import { NextResponse } from 'next/server';
import openai from '../../utils/openai';

export async function GET() {
  try {
    // Log the API key (first few characters) for debugging
    console.log('API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 10));
    
    // Test OpenAI connection
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Hello, this is a test message. Please respond with 'OK' if you receive this."
        }
      ],
      model: "gpt-4",
    });

    return NextResponse.json({
      status: 'success',
      message: completion.choices[0].message.content
    });
    
  } catch (error: any) {
    console.error('OpenAI Test Error:', error.message);
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
} 