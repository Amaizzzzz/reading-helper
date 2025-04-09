import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word');
    const userId = searchParams.get('userId');

    if (!word || !userId) {
      return NextResponse.json(
        { error: 'Word and userId are required' },
        { status: 400 }
      );
    }

    const existingFlashcard = await prisma.flashcard.findFirst({
      where: {
        word: word,
        userId: userId,
      },
    });

    return NextResponse.json({ exists: !!existingFlashcard });
  } catch (error) {
    console.error('Error checking flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to check flashcard' },
      { status: 500 }
    );
  }
} 