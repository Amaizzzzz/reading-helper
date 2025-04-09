import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/reading-list - Get all reading list items for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const readingList = await prisma.readingList.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(readingList);
  } catch (error) {
    console.error('Error fetching reading list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading list' },
      { status: 500 }
    );
  }
}

// POST /api/reading-list - Create a new reading list item
export async function POST(request: Request) {
  try {
    const { title, content, userId } = await request.json();

    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: 'Title, content, and user ID are required' },
        { status: 400 }
      );
    }

    const readingListItem = await prisma.readingList.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return NextResponse.json(readingListItem);
  } catch (error) {
    console.error('Error creating reading list item:', error);
    return NextResponse.json(
      { error: 'Failed to create reading list item' },
      { status: 500 }
    );
  }
}

// PUT /api/reading-list - Update a reading list item
export async function PUT(request: Request) {
  try {
    const { id, title, content } = await request.json();

    if (!id || !title || !content) {
      return NextResponse.json(
        { error: 'ID, title, and content are required' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.readingList.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating reading list item:', error);
    return NextResponse.json(
      { error: 'Failed to update reading list item' },
      { status: 500 }
    );
  }
}

// DELETE /api/reading-list - Delete a reading list item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.readingList.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reading list item:', error);
    return NextResponse.json(
      { error: 'Failed to delete reading list item' },
      { status: 500 }
    );
  }
} 