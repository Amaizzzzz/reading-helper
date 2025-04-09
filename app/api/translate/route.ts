import { NextResponse } from 'next/server';
import openai from '../../utils/openai';
import { TranslationEntry } from '../../types/translation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Convert 1-5 scale to descriptive level
function getHintLevel(level: number) {
  switch (level) {
    case 1: return 'INDIRECT_HINTS';
    case 2: return 'CONTEXT_CLUES';
    case 3: return 'BASIC_TRANSLATION';
    case 4: return 'CLEAR_TRANSLATION';
    case 5: return 'COMPREHENSIVE';
    default: return 'BASIC_TRANSLATION';
  }
}

function getDetailLevel(level: number) {
  switch (level) {
    case 1: return 'BASIC';
    case 2: return 'WITH_EXAMPLES';
    case 3: return 'WITH_VOCABULARY';
    case 4: return 'WITH_GRAMMAR';
    case 5: return 'FULL_ANALYSIS';
    default: return 'BASIC';
  }
}

function parseOpenAIResponse(response: string, hintLevel: number, detailLevel: number): Omit<TranslationEntry, 'word' | 'context'> {
  const result = {
    translation: {
      basic: {
        translation: '',
        examples: [] as string[]
      }
    } as NonNullable<TranslationEntry['translation']>,
    suggestions: {
      vocabulary: [],
      grammar: [],
      usage: [],
      memory: []
    } as NonNullable<TranslationEntry['suggestions']>,
    examples: [] as string[],
    difficulty: Math.min(5, Math.max(1, Math.round((hintLevel + detailLevel) / 2)))
  };

  if (!response) {
    result.translation.basic.translation = 'No translation available';
    return result;
  }

  try {
    // Split response into sections and filter out empty sections
    const sections = response.split('\n\n')
      .map(section => section.trim())
      .filter(Boolean);
    
    // Parse each section based on hint and detail levels
    sections.forEach(section => {
      const lines = section.split('\n')
        .map(line => line.trim())
        .filter(Boolean);
      
      if (lines.length === 0) return;

      const sectionTitle = lines[0].toLowerCase();
      const sectionContent = lines.slice(1)
        .map(line => line.replace(/^[•\-*]\s*|\[|\]/g, ''))
        .filter(Boolean);
      
      // Handle explanation/definition based on hint level
      if (sectionTitle.includes('explanation') || sectionTitle.includes('definition') || sectionTitle.includes('hint')) {
        const explanation = sectionContent.join(' ');
        result.translation.basic.translation = explanation;
        
        // Add more detailed translations based on hint level
        if (hintLevel >= 3) {
          if (!result.translation.detailed) {
            result.translation.detailed = {
              translation: explanation,
              examples: [],
              notes: []
            };
          }
        }
        
        if (hintLevel >= 5) {
          if (!result.translation.technical) {
            result.translation.technical = {
              translation: explanation,
              examples: [],
              domain: ''
            };
          }
        }
      }
      
      // Handle examples based on detail level
      if (sectionTitle.includes('example')) {
        const examples = sectionContent.filter(ex => 
          !ex.toLowerCase().includes('example') &&
          !ex.toLowerCase().includes('[') &&
          !ex.toLowerCase().includes(']')
        );
        
        // Add examples based on detail level
        if (examples.length > 0) {
          result.translation.basic.examples = examples.slice(0, detailLevel);
          result.examples = examples;
          
          if (result.translation.detailed) {
            result.translation.detailed.examples = examples;
          }
          
          if (result.translation.technical) {
            result.translation.technical.examples = examples;
          }
        }
      }
      
      // Handle vocabulary and related words based on detail level
      if ((detailLevel >= 3) && (sectionTitle.includes('related') || sectionTitle.includes('vocabulary'))) {
        const vocabulary = sectionContent.filter(word => 
          !word.toLowerCase().includes('related') &&
          !word.toLowerCase().includes('vocabulary')
        );
        result.suggestions.vocabulary = vocabulary;
      }
      
      // Handle grammar notes based on detail level
      if ((detailLevel >= 4) && sectionTitle.includes('grammar')) {
        const grammar = sectionContent.filter(note => 
          !note.toLowerCase().includes('grammar')
        );
        result.suggestions.grammar = grammar;
        
        if (result.translation.detailed) {
          result.translation.detailed.notes = grammar;
        }
      }
      
      // Handle usage tips and collocations based on detail level
      if ((detailLevel >= 5) && (sectionTitle.includes('usage') || sectionTitle.includes('collocation'))) {
        const usage = sectionContent.filter(tip => 
          !tip.toLowerCase().includes('usage') &&
          !tip.toLowerCase().includes('collocation')
        );
        result.suggestions.usage = usage;
      }
    });

    return result;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    result.translation.basic.translation = 'Error parsing translation';
    return result;
  }
}

export async function POST(request: Request) {
  try {
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    const { text, context, sourceLang, targetLang, hintLevel = 3, translationDetail = 3 } = await request.json();
    
    console.log('Translation request received:', { text, sourceLang, targetLang, hintLevel, translationDetail });

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Normalize levels to 1-5 range
    const normalizedHintLevel = Math.max(1, Math.min(5, Math.round(hintLevel)));
    const normalizedDetailLevel = Math.max(1, Math.min(5, Math.round(translationDetail)));

    try {
      console.log('Sending request to OpenAI...');
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an English language learning assistant. Analyze and explain English words and phrases with increasing detail based on the specified levels.

Hint Level ${normalizedHintLevel}/5 - Explanation Style:
${normalizedHintLevel === 1 ? '- Very indirect hints about meaning through etymology and word relationships' : ''}
${normalizedHintLevel === 2 ? '- Contextual clues and related synonyms without direct explanation' : ''}
${normalizedHintLevel === 3 ? '- Clear but concise explanation of meaning' : ''}
${normalizedHintLevel === 4 ? '- Detailed explanation with multiple contexts and nuances' : ''}
${normalizedHintLevel === 5 ? '- Comprehensive explanation with etymology, nuances, and detailed usage patterns' : ''}

Detail Level ${normalizedDetailLevel}/5 - Content Depth:
${normalizedDetailLevel >= 1 ? '- Basic definition and primary meaning' : ''}
${normalizedDetailLevel >= 2 ? '\n- Multiple example sentences showing different contexts' : ''}
${normalizedDetailLevel >= 3 ? '\n- Related vocabulary and synonyms/antonyms' : ''}
${normalizedDetailLevel >= 4 ? '\n- Detailed grammar explanations and usage patterns' : ''}
${normalizedDetailLevel >= 5 ? '\n- Idiomatic expressions, common collocations, and advanced usage tips' : ''}`
          },
          {
            role: "user",
            content: `Analyze this English word/phrase: "${text}"
Context: "${context || 'No context provided'}"

Based on the hint level (${normalizedHintLevel}/5) and detail level (${normalizedDetailLevel}/5), provide:

1. ${normalizedHintLevel <= 2 ? 'Indirect hints about meaning' : 'Explanation/Definition'}
2. Example sentences${normalizedDetailLevel >= 3 ? ' in various contexts' : ''}
${normalizedDetailLevel >= 3 ? '3. Related vocabulary and synonyms' : ''}
${normalizedDetailLevel >= 4 ? '4. Grammar notes and usage patterns' : ''}
${normalizedDetailLevel >= 5 ? '5. Idiomatic expressions and collocations' : ''}`
          }
        ],
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content || '';
      console.log('OpenAI response received');

      const parsedResponse = parseOpenAIResponse(response, normalizedHintLevel, normalizedDetailLevel);
      
      const result: TranslationEntry = {
        word: text,
        context: context || '',
        ...parsedResponse
      };

      // Create flashcard in database
      const flashcard = await prisma.flashcard.create({
        data: {
          word: text,
          directTranslation: parsedResponse.translation.basic.translation,
          translation: JSON.stringify(result),
          difficulty: 3,
          reviewCount: 0,
          userId: 'test-user-1',
          lastReviewed: null,
          nextReview: null,
          masteryLevel: 0,
          correctStreak: 0,
          status: 'active',
          translations: {
            create: [
              {
                text: parsedResponse.translation.basic.translation,
                language: 'en',
              },
            ],
          },
        },
      });

      return NextResponse.json({
        translation: result,
        flashcardId: flashcard.id
      });
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      return NextResponse.json(
        { 
          error: 'Translation service error',
          details: error.message,
          code: error.code || 'UNKNOWN'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { 
        error: 'Invalid request',
        details: error.message
      },
      { status: 400 }
    );
  }
} 