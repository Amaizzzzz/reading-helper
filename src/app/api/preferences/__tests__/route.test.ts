/**
 * @jest-environment node
 */

import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Mock console.error to suppress error messages in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    userPreferences: {
      findUnique: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

describe('Preferences API', () => {
  const mockPrisma = prisma.userPreferences as jest.Mocked<typeof prisma.userPreferences>;
  const mockDate = new Date('2025-03-13T05:27:53.152Z');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/preferences', () => {
    it('returns existing preferences', async () => {
      const mockPreferences = {
        id: '1',
        userId: 'default-user',
        hintLevel: 50,
        translationDetail: 50,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      mockPrisma.findUnique.mockResolvedValueOnce({
        ...mockPreferences,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockPreferences,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString(),
      });
      expect(mockPrisma.findUnique).toHaveBeenCalledWith({
        where: { userId: 'default-user' },
      });
    });

    it('creates default preferences if none exist', async () => {
      mockPrisma.findUnique.mockResolvedValueOnce(null);
      
      const mockCreatedPreferences = {
        id: '1',
        userId: 'default-user',
        hintLevel: 50,
        translationDetail: 50,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      mockPrisma.create.mockResolvedValueOnce({
        ...mockCreatedPreferences,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockCreatedPreferences,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString(),
      });
      expect(mockPrisma.create).toHaveBeenCalledWith({
        data: {
          userId: 'default-user',
          hintLevel: 50,
          translationDetail: 50,
        },
      });
    });

    it('handles database errors', async () => {
      mockPrisma.findUnique.mockRejectedValueOnce(new Error('Database error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch preferences' });
    });
  });

  describe('POST /api/preferences', () => {
    it('updates existing preferences', async () => {
      const mockUpdatedPreferences = {
        id: '1',
        userId: 'default-user',
        hintLevel: 75,
        translationDetail: 50,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      mockPrisma.upsert.mockResolvedValueOnce({
        ...mockUpdatedPreferences,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      const response = await POST(new Request('http://localhost/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hintLevel: 75 }),
      }));

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ...mockUpdatedPreferences,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString(),
      });
      expect(mockPrisma.upsert).toHaveBeenCalledWith({
        where: { userId: 'default-user' },
        create: {
          userId: 'default-user',
          hintLevel: 75,
          translationDetail: 50,
        },
        update: { hintLevel: 75 },
      });
    });

    it('validates hint level range', async () => {
      const response = await POST(new Request('http://localhost/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hintLevel: 150 }),
      }));

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Hint level must be between 0 and 100' });
      expect(mockPrisma.upsert).not.toHaveBeenCalled();
    });

    it('validates translation detail range', async () => {
      const response = await POST(new Request('http://localhost/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translationDetail: -10 }),
      }));

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Translation detail must be between 0 and 100' });
      expect(mockPrisma.upsert).not.toHaveBeenCalled();
    });

    it('handles database errors during update', async () => {
      mockPrisma.upsert.mockRejectedValueOnce(new Error('Database error'));

      const response = await POST(new Request('http://localhost/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hintLevel: 75 }),
      }));

      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to update preferences' });
    });
  });
}); 