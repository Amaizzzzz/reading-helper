import { NextResponse } from 'next/server';
import openai from '@/utils/openai';
import { getStoredPreferences } from '@/utils/userPreferences';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { text, sourceLang, targetLang } = await request.json();
    
    // Get preferences from database instead of localStorage
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: 'default-user' }
    }) || { hintLevel: 50, translationDetail: 50 };

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Adjust detail level based on user preferences
    const detailLevel = preferences.translationDetail;
    const hintLevel = preferences.hintLevel;

    // Customize prompt based on user preferences
    const prompt = `
      As a language learning assistant, help the user understand the following text.
      Adjust your response based on these user preferences:
      - Hint Level: ${hintLevel}/100 (lower means more indirect hints to help discovery, higher means more direct explanations)
      - Detail Level: ${detailLevel}/100 (lower means brief explanations, higher means comprehensive explanations)

      Text: "${text}"
      Source Language: ${sourceLang || 'auto-detect'}
      Target Language: ${targetLang || 'English'}

      Please structure your response exactly as follows:

      ${hintLevel < 30 ? `1. Context Hints (provide contextual clues and similar words in English that might help understand the meaning, 
         but DO NOT provide direct translation)` : '1. Translation'}
      ${detailLevel > 30 ? '2. Key vocabulary and phrases' : ''}
      ${detailLevel > 50 ? '3. Grammar explanations' : ''}
      ${detailLevel > 70 ? '4. Usage examples' : ''}

      Response guidelines based on user preferences:
      ${hintLevel < 30 ? 
        `- DO NOT provide direct translation
         - Instead, provide contextual hints like:
           * Similar words in English or cognates
           * Context clues about usage
           * Related concepts or situations
           * Word family or etymology hints` : ''}
      ${hintLevel >= 30 && hintLevel < 70 ? '- Provide balanced explanations with moderate detail' : ''}
      ${hintLevel >= 70 ? '- Provide comprehensive explanations with detailed context and learning tips' : ''}
      ${detailLevel < 30 ? '- Keep responses brief and focused' : ''}
      ${detailLevel >= 30 && detailLevel < 70 ? '- Include moderate detail in explanations' : ''}
      ${detailLevel >= 70 ? '- Provide extensive examples and detailed explanations' : ''}
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a language learning assistant that adapts to user preferences. 
                   For low hint levels (< 30), you should never provide direct translations, but instead give helpful hints that lead users to discover the meaning themselves.
                   Hint Level: ${hintLevel}/100 - ${hintLevel < 30 ? 'discovery hints' : hintLevel >= 70 ? 'detailed hints' : 'moderate hints'}
                   Detail Level: ${detailLevel}/100 - ${detailLevel < 30 ? 'brief' : detailLevel >= 70 ? 'comprehensive' : 'moderate'}`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4",
      temperature: 0.7,
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
      preferences: {
        hintLevel,
        detailLevel
      }
    });
    
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to process translation' },
      { status: 500 }
    );
  }
} 