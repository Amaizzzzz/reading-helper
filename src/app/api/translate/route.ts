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
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    const { text, sourceLang, targetLang, hintLevel = 3, translationDetail = 3 } = await request.json();
    
    console.log('Translation request received:', { text, sourceLang, targetLang, hintLevel, translationDetail });

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
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
            content: `You are a language learning assistant. Provide translations based on the specified hint and detail levels. Format your response with clear headers and bullet points. ALWAYS start with the direct translation (or hint based on level) on the first line after "Translation:"`
          },
          {
            role: "user",
            content: `Translate this text: "${text}"
Source Language: ${sourceLang || 'auto-detect'}
Target Language: ${targetLang || 'English'}

Hint Level: ${normalizedHintLevel}/5 (${getHintLevel(normalizedHintLevel)})
Detail Level: ${normalizedDetailLevel}/5 (${getDetailLevel(normalizedDetailLevel)})

Format your response as follows:

Translation:
<TRANSLATION HERE>

${normalizedDetailLevel >= 2 ? `Examples:
• Example 1
• Example 2` : ''}

${normalizedDetailLevel >= 3 ? `Related Words:
• Related word 1
• Related word 2` : ''}

${normalizedDetailLevel >= 4 ? `Grammar Notes:
• Grammar note 1
• Grammar note 2

Usage Tips:
• Usage tip 1
• Usage tip 2` : ''}

For hint level ${normalizedHintLevel}:
${normalizedHintLevel === 1 ? '- Give ONLY indirect hints and etymology. NO direct translation.' : ''}
${normalizedHintLevel === 2 ? '- Provide context clues and synonyms.' : ''}
${normalizedHintLevel === 3 ? '- Give a basic translation.' : ''}
${normalizedHintLevel === 4 ? '- Provide clear translation with context.' : ''}
${normalizedHintLevel === 5 ? '- Give comprehensive translation with explanations.' : ''}`
          }
        ],
        model: "gpt-4",
        temperature: 0.3, // Lower temperature for more consistent formatting
      });

      console.log('Received response from OpenAI');
      const response = completion.choices[0].message.content || '';
      console.log('OpenAI response:', response);
      
      // First try to get the translation directly
      let translation = '';
      const lines = response.split('\n');
      const translationIndex = lines.findIndex(line => 
        line.toLowerCase().trim() === 'translation:');
      
      if (translationIndex !== -1 && translationIndex + 1 < lines.length) {
        translation = lines[translationIndex + 1].trim();
      }

      // If no translation found, try parsing the whole response
      if (!translation) {
        const parsedResponse = parseOpenAIResponse(response, normalizedHintLevel, normalizedDetailLevel);
        translation = parsedResponse.translation.basic.translation;
      }

      // Create the full result
      const result: TranslationEntry = {
        word: text,
        context: '',
        translation: {
          basic: {
            translation: translation || 'Translation not available',
            examples: []
          }
        },
        suggestions: {
          vocabulary: [],
          grammar: [],
          usage: [],
          memory: []
        },
        examples: [],
        difficulty: Math.min(5, Math.max(1, Math.round((normalizedHintLevel + normalizedDetailLevel) / 2)))
      };

      // Parse additional details if needed
      if (normalizedDetailLevel > 1) {
        const parsedResponse = parseOpenAIResponse(response, normalizedHintLevel, normalizedDetailLevel);
        result.examples = parsedResponse.examples;
        result.suggestions = parsedResponse.suggestions;
        if (normalizedDetailLevel >= 3) {
          result.translation.detailed = parsedResponse.translation.detailed;
        }
        if (normalizedDetailLevel >= 5) {
          result.translation.technical = parsedResponse.translation.technical;
        }
      }

      console.log('Sending response:', result);
      return NextResponse.json({
        result,
        preferences: {
          hintLevel: normalizedHintLevel,
          translationDetail: normalizedDetailLevel
        }
      });
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