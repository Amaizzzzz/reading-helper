import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Constants for mastery calculation
const MASTERY_THRESHOLD = 90; // Consider mastered when mastery level reaches this
const CORRECT_STREAK_FOR_MASTERY = 5; // Number of consecutive correct answers needed
const MASTERY_INCREASE = 15; // How much mastery increases with each correct answer
const MASTERY_DECREASE = 10; // How much mastery decreases with each incorrect answer

type ReviewResult = 'correct' | 'incorrect' | 'hint';

// POST /api/flashcards/review - Record a review for a flashcard
export async function POST(request: Request) {
  try {
    const { flashcardId, userId, status, correctStreak, isMastered } = await request.json();

    if (!flashcardId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the flashcard with review data
    const updatedFlashcard = await prisma.flashcard.update({
      where: {
        id: flashcardId,
      },
      data: {
        lastReviewed: new Date(),
        correctStreak: correctStreak || 0,
        status: isMastered ? 'mastered' : 'active',
        reviewCount: {
          increment: 1,
        },
        masteryLevel: isMastered ? 100 : Math.min((correctStreak || 0) * 25, 100), // 25% per correct streak, max 100%
      },
    });

    return NextResponse.json(updatedFlashcard);
  } catch (error) {
    console.error('Error updating flashcard review:', error);
    return NextResponse.json(
      { error: 'Failed to update flashcard review' },
      { status: 500 }
    );
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