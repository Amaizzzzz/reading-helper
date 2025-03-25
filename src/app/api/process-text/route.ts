import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ProcessTextRequest {
  text: string;
  hintLevel: number;
  translationDetail: number;
}

export async function POST(request: Request) {
  try {
    const { text, hintLevel, translationDetail } = await request.json() as ProcessTextRequest;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Calculate hint and translation detail based on percentages
    const hintDetail = Math.max(1, Math.floor(hintLevel / 20)); // Convert percentage to 1-5 scale
    const translationDetailLevel = Math.max(1, Math.floor(translationDetail / 20)); // Convert percentage to 1-5 scale

    // Generate hint based on hint level
    const hintPrompt = `Provide a ${hintDetail}-level hint for this English text (1=very basic, 5=very detailed): "${text}". 
    For level ${hintDetail}, focus on ${hintDetail === 1 ? 'basic meaning' : 
      hintDetail === 2 ? 'key words and phrases' : 
      hintDetail === 3 ? 'sentence structure and context' : 
      hintDetail === 4 ? 'nuances and implications' : 
      'complete analysis'}.`;

    const hintResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: hintPrompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    // Generate translation based on detail level
    const translationPrompt = `Translate this English text to Chinese with ${translationDetailLevel}-level detail (1=basic, 5=very detailed): "${text}".
    For level ${translationDetailLevel}, provide ${translationDetailLevel === 1 ? 'a simple translation' : 
      translationDetailLevel === 2 ? 'translation with key vocabulary' : 
      translationDetailLevel === 3 ? 'translation with grammar notes' : 
      translationDetailLevel === 4 ? 'translation with cultural context' : 
      'translation with comprehensive analysis'}.`;

    const translationResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: translationPrompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      hint: hintResponse.choices[0].message.content?.trim() || 'No hint available',
      translation: translationResponse.choices[0].message.content?.trim() || 'No translation available'
    });
  } catch (error) {
    console.error('Error processing text:', error);
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    );
  }
} 