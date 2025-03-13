import { NextResponse } from 'next/server';
import openai from '@/utils/openai';

export async function POST(request: Request) {
  try {
    const { text, hintLevel = 50, translationDetail = 50 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided for translation' },
        { status: 400 }
      );
    }

    console.log('Translation request received:', { text, hintLevel, translationDetail });

    const prompt = `
      As a language learning assistant, help the user understand the following text by translating it to English.
      Adjust your response based on these user preferences:
      - Hint Level: ${hintLevel}/100 (lower means more indirect hints to help discovery, higher means more direct explanations)
      - Detail Level: ${translationDetail}/100 (lower means brief explanations, higher means comprehensive explanations)

      Text to translate: "${text}"
      Target Language: English

      Please structure your response EXACTLY as follows, with each section clearly marked:

      Context Hints:
      ${hintLevel < 30 ? 
        `Provide contextual clues and similar words in English that might help understand the meaning, but DO NOT provide direct translation.
         Include:
         - Similar words in English or cognates
         - Context clues about usage
         - Related concepts or situations
         - Word family or etymology hints` : 
        'Provide a brief context about how this word or phrase is typically used.'}

      Basic Translation:
      Provide a simple, direct translation of the text.

      Detailed Translation:
      Provide a comprehensive translation with additional context and nuances.

      Learning Tips:
      Provide memory aids, usage examples, and tips for remembering this word or phrase.
    `;

    console.log('Sending request to OpenAI...');
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a language learning assistant that translates text to English and adapts to user preferences. 
                   For low hint levels (< 30), you should never provide direct translations, but instead give helpful hints that lead users to discover the meaning themselves.
                   Hint Level: ${hintLevel}/100 - ${hintLevel < 30 ? 'discovery hints' : hintLevel >= 70 ? 'detailed hints' : 'moderate hints'}
                   Detail Level: ${translationDetail}/100 - ${translationDetail < 30 ? 'brief' : translationDetail >= 70 ? 'comprehensive' : 'moderate'}`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4",
      temperature: 0.7,
    });

    console.log('Received response from OpenAI');

    return NextResponse.json({
      text: text,
      translation: completion.choices[0].message.content,
      difficulty: 'intermediate',
      pronunciation: 'mock-pronunciation' // We can add real pronunciation later
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    );
  }
}
