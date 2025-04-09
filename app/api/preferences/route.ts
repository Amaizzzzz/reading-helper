import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// Temporary user ID until authentication is implemented
const TEMP_USER_ID = 'default-user';

export async function GET() {
  try {
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: TEMP_USER_ID },
    });

    if (!preferences) {
      // Create default preferences if none exist
      preferences = await prisma.userPreferences.create({
        data: {
          userId: TEMP_USER_ID,
          hintLevel: 50,
          translationDetail: 50,
        },
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    
    // Validate input
    if ('hintLevel' in updates && (updates.hintLevel < 0 || updates.hintLevel > 100)) {
      return NextResponse.json(
        { error: 'Hint level must be between 0 and 100' },
        { status: 400 }
      );
    }
    
    if ('translationDetail' in updates && (updates.translationDetail < 0 || updates.translationDetail > 100)) {
      return NextResponse.json(
        { error: 'Translation detail must be between 0 and 100' },
        { status: 400 }
      );
    }

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: TEMP_USER_ID },
      create: {
        userId: TEMP_USER_ID,
        hintLevel: updates.hintLevel ?? 50,
        translationDetail: updates.translationDetail ?? 50,
      },
      update: updates,
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
} 