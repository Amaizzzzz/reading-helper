'use client';

import React, { useState, useEffect } from 'react';
import { FlashcardData } from '../types/flashcard';
import Link from 'next/link';

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({
    word: '',
    translation: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch('/api/flashcards?userId=test-user-1');
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: newFlashcard.word,
          translations: [{
            text: newFlashcard.translation,
            language: 'en'
          }],
          userId: 'test-user-1'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add flashcard');
      }

      const addedCard = await response.json();
      setFlashcards(prev => [...prev, addedCard]);
      setNewFlashcard({ word: '', translation: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding flashcard:', error);
      alert('Failed to add flashcard. Please try again.');
    }
  };

  const handleEdit = async () => {
    if (!editingId || !editingCard) return;

    try {
      const response = await fetch(`/api/flashcards?id=${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: editingCard.word,
          translations: [{
            text: editingCard.directTranslation,
            language: 'en'
          }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update flashcard');
      }

      const updatedCard = await response.json();
      setFlashcards(prev => prev.map(card => 
        card.id === editingId ? updatedCard : card
      ));
      setEditingId(null);
      setEditingCard(null);
    } catch (error) {
      console.error('Error updating flashcard:', error);
      alert('Failed to update flashcard. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      const response = await fetch(`/api/flashcards?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete flashcard');
      }

      setFlashcards(prev => prev.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      alert('Failed to delete flashcard. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Flashcards</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Add New Flashcard */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Flashcard</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase</label>
              <input
                type="text"
                value={newFlashcard.word}
                onChange={(e) => setNewFlashcard(prev => ({ ...prev, word: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter word or phrase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Translation</label>
              <input
                type="text"
                value={newFlashcard.translation}
                onChange={(e) => setNewFlashcard(prev => ({ ...prev, translation: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter translation"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newFlashcard.word || !newFlashcard.translation}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Add Flashcard
            </button>
          </div>
        </div>

        {/* Flashcards List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Your Flashcards</h2>
          {isLoading ? (
            <div className="text-center text-gray-500">Loading flashcards...</div>
          ) : flashcards.length === 0 ? (
            <div className="text-center text-gray-500">No flashcards yet. Add some to get started!</div>
          ) : (
            <div className="space-y-4">
              {flashcards.map((card) => (
                <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                  {editingId === card.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingCard?.word}
                        onChange={(e) => setEditingCard(prev => prev ? { ...prev, word: e.target.value } : null)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={editingCard?.directTranslation}
                        onChange={(e) => setEditingCard(prev => prev ? { ...prev, directTranslation: e.target.value } : null)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleEdit}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingCard(null);
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{card.word}</div>
                        <div className="text-gray-600">{card.directTranslation}</div>
                        <div className="text-sm text-gray-500 mt-2">
                          Last reviewed: {card.lastReviewed ? new Date(card.lastReviewed).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/flashcards/practice?id=${card.id}`}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          Practice
                        </Link>
                        <button
                          onClick={() => {
                            setEditingId(card.id);
                            setEditingCard(card);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 