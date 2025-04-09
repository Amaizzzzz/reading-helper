import { NextResponse } from 'next/server';
import openai from '../../utils/openai';

export async function GET() {
  try {
    // Check if environment variable is set
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // Test API connection
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Test connection" }],
      model: "gpt-3.5-turbo",
      max_tokens: 5
    });

    return NextResponse.json({
      status: 'success',
      apiResponse: completion.choices[0].message,
    });

  } catch (error: any) {
    console.error('API Test Error:', {
      message: error.message,
      type: error.constructor.name
    });

    return NextResponse.json({
      status: 'error',
      error: error.message,
      type: error.constructor.name
    }, { status: 500 });
  }
} 