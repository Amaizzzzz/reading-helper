import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET /api/flashcards - Get all flashcards for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const flashcards = await prisma.flashcard.findMany({
      where: { userId },
      include: {
        translations: true,
        reviews: {
          orderBy: { reviewedAt: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 });
  }
}

// POST /api/flashcards - Create a new flashcard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, translations, userId } = body;

    if (!word || !translations || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use the first translation as the direct translation
    const directTranslation = translations[0]?.text || word;

    const flashcard = await prisma.flashcard.create({
      data: {
        word,
        userId,
        directTranslation,
        translations: {
          create: translations.map((t: { text: string; language: string }) => ({
            text: t.text,
            language: t.language,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(flashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return NextResponse.json({ error: 'Failed to create flashcard' }, { status: 500 });
  }
}

// PUT /api/flashcards/:id - Update a flashcard
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { word, translations } = body;

    if (!id) {
      return NextResponse.json({ error: 'Flashcard ID is required' }, { status: 400 });
    }

    // Use the first translation as the direct translation
    const directTranslation = translations[0]?.text || word;

    // Delete existing translations and create new ones
    const flashcard = await prisma.flashcard.update({
      where: { id },
      data: {
        word,
        directTranslation,
        translations: {
          deleteMany: {},
          create: translations.map((t: { text: string; language: string }) => ({
            text: t.text,
            language: t.language,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json(flashcard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    return NextResponse.json({ error: 'Failed to update flashcard' }, { status: 500 });
  }
}

// DELETE /api/flashcards/:id - Delete a flashcard
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Flashcard ID is required' }, { status: 400 });
    }

    await prisma.flashcard.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return NextResponse.json({ error: 'Failed to delete flashcard' }, { status: 500 });
  }
} 