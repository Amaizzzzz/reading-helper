import { NextResponse } from 'next/server';
import openai from '@/utils/openai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an English tutor helping students practice English. 
          Your responses should be:
          1. Clear and concise
          2. Focused on helping the student learn
          3. Include corrections when needed
          4. Provide explanations for grammar or vocabulary when relevant
          5. Encourage conversation and learning`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
} 