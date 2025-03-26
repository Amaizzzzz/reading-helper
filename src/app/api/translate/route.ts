import { NextResponse } from 'next/server';
import openai from '@/utils/openai';
import { TranslationEntry } from '@/types/translation';

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
  // Initialize the structure with required fields
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
    
    // Parse each section
    sections.forEach(section => {
      const lines = section.split('\n')
        .map(line => line.trim())
        .filter(Boolean);
      
      if (lines.length === 0) return;

      const sectionTitle = lines[0].toLowerCase();
      const sectionContent = lines.slice(1)
        .map(line => line.replace(/^[•\-*]\s*|\[|\]/g, ''))
        .filter(Boolean);
      
      // Basic translation - look for actual translation content
      if (sectionTitle.includes('translation')) {
        // Get the first non-empty line after "Translation:"
        const translationText = sectionContent[0];
        if (translationText && !translationText.toLowerCase().includes('your translation')) {
          result.translation.basic.translation = translationText;
          
          // If we have detailed level, copy the translation there too
          if (detailLevel >= 3) {
            if (!result.translation.detailed) {
              result.translation.detailed = {
                translation: translationText,
                examples: [],
                notes: []
              };
            } else {
              result.translation.detailed.translation = translationText;
            }
          }
        }
      }
      
      // Examples
      if (sectionTitle.includes('example')) {
        const examples = sectionContent.filter(ex => 
          !ex.toLowerCase().includes('example sentence') &&
          !ex.toLowerCase().includes('[') &&
          !ex.toLowerCase().includes(']')
        );
        if (examples.length > 0) {
          result.translation.basic.examples = examples;
          result.examples = examples;
          
          if (result.translation.detailed) {
            result.translation.detailed.examples = examples;
          }
        }
      }
      
      // Related Words / Vocabulary
      if (sectionTitle.includes('related word') || sectionTitle.includes('vocabulary')) {
        const vocabulary = sectionContent.filter(word => 
          !word.toLowerCase().includes('related word') &&
          !word.toLowerCase().includes('word or phrase')
        );
        result.suggestions.vocabulary = vocabulary;
      }
      
      // Grammar Notes
      if (sectionTitle.includes('grammar')) {
        const grammar = sectionContent.filter(note => 
          !note.toLowerCase().includes('grammar point')
        );
        result.suggestions.grammar = grammar;
        
        if (result.translation.detailed) {
          result.translation.detailed.notes = grammar;
        }
      }
      
      // Usage Tips
      if (sectionTitle.includes('usage')) {
        const usage = sectionContent.filter(tip => 
          !tip.toLowerCase().includes('usage tip')
        );
        result.suggestions.usage = usage;
      }
    });

    // Add technical translation for highest detail level
    if (detailLevel >= 5 && !result.translation.technical) {
      result.translation.technical = {
        translation: result.translation.basic.translation,
        examples: result.translation.basic.examples,
        domain: ''
      };
    }

    // If we still don't have a translation, try to extract it from the raw response
    if (!result.translation.basic.translation) {
      const translationMatch = response.match(/Translation:\s*\n\s*([^\n]+)/);
      if (translationMatch && translationMatch[1]) {
        const cleanTranslation = translationMatch[1].replace(/[\[\]]/g, '').trim();
        if (!cleanTranslation.toLowerCase().includes('your translation')) {
          result.translation.basic.translation = cleanTranslation;
          if (result.translation.detailed) {
            result.translation.detailed.translation = cleanTranslation;
          }
          if (result.translation.technical) {
            result.translation.technical.translation = cleanTranslation;
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    result.translation.basic.translation = 'Error parsing translation';
    return result;
  }
}

export async function POST(request: Request) {
  try {
    console.log('=== TRANSLATION API CALLED ===');
    const { text, sourceLang, targetLang, hintLevel = 3, translationDetail = 3 } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a language learning assistant. Provide translations and explanations in a clear, structured format. Include basic translation, detailed explanation, technical information, related words, grammar notes, and usage tips.`
          },
          {
            role: "user",
            content: `Translate and explain this text: "${text}"
Source Language: ${sourceLang || 'auto-detect'}
Target Language: ${targetLang || 'English'}

Please provide the information in this exact format:

Translation:
[Basic translation of the word/phrase]

Detailed:
[Translation with context]
[Brief explanation of meaning and usage]

Technical:
[Technical or formal translation if applicable]
[Domain or field where this term is commonly used]

Related Words:
• [Related word or synonym 1]
• [Related word or synonym 2]
• [Related word or synonym 3]

Grammar Notes:
• [Grammar point 1]
• [Grammar point 2]

Usage Tips:
• [Usage tip 1]
• [Usage tip 2]`
          }
        ],
        model: "gpt-4",
        temperature: 0.3,
      });

      const response = completion.choices[0].message.content || '';
      console.log('OpenAI response:', response);

      // Parse the response into sections
      const sections = response.split('\n\n');
      const result: TranslationEntry = {
        word: text,
        context: '',
        translation: {
          basic: { translation: '', examples: [] },
          detailed: { translation: '', examples: [], notes: [] },
          technical: { translation: '', examples: [], domain: '' }
        },
        suggestions: {
          vocabulary: [],
          grammar: [],
          usage: [],
          memory: []
        },
        examples: [],
        difficulty: 3
      };

      sections.forEach(section => {
        const lines = section.trim().split('\n');
        const title = lines[0].toLowerCase();
        const content = lines.slice(1).map(line => line.trim().replace(/^[•\-*]\s*/, ''));

        if (title.startsWith('translation:')) {
          result.translation.basic.translation = content[0] || '';
        }
        else if (title.startsWith('detailed:')) {
          const detailed = result.translation.detailed;
          if (detailed) {
            detailed.translation = content[0] || '';
            detailed.notes = content.slice(1);
          }
        }
        else if (title.startsWith('technical:')) {
          const technical = result.translation.technical;
          if (technical) {
            technical.translation = content[0] || '';
            technical.domain = content[1] || 'general';
          }
        }
        else if (title.startsWith('related words:')) {
          const suggestions = result.suggestions;
          if (suggestions) {
            suggestions.vocabulary = content;
          }
        }
        else if (title.startsWith('grammar notes:')) {
          const suggestions = result.suggestions;
          if (suggestions) {
            suggestions.grammar = content;
          }
        }
        else if (title.startsWith('usage tips:')) {
          const suggestions = result.suggestions;
          if (suggestions) {
            suggestions.usage = content;
          }
        }
      });

      // Ensure we have at least basic translation
      if (!result.translation.basic.translation) {
        result.translation.basic.translation = text;
      }

      console.log('Parsed result:', result);
      return NextResponse.json({ result });

    } catch (error) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'OpenAI API request failed' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to process translation request' },
      { status: 400 }
    );
  }
} 