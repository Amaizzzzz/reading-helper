import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/flashcards/review - Record a review for a flashcard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flashcardId, userId, status } = body;

    if (!flashcardId || !userId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['correct', 'incorrect', 'hint_used'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const review = await prisma.reviewHistory.create({
      data: {
        flashcardId,
        userId,
        status,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error recording review:', error);
    return NextResponse.json({ error: 'Failed to record review' }, { status: 500 });
  }
}

// GET /api/flashcards/review - Get review history for a flashcard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flashcardId = searchParams.get('flashcardId');
    const userId = searchParams.get('userId');

    if (!flashcardId || !userId) {
      return NextResponse.json({ error: 'Flashcard ID and User ID are required' }, { status: 400 });
    }

    const reviews = await prisma.reviewHistory.findMany({
      where: {
        flashcardId,
        userId,
      },
      orderBy: {
        reviewedAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching review history:', error);
    return NextResponse.json({ error: 'Failed to fetch review history' }, { status: 500 });
  }
} 