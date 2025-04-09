'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReadingListItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReadingListPage() {
  const [items, setItems] = useState<ReadingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ReadingListItem | null>(null);

  useEffect(() => {
    fetchReadingList();
  }, []);

  const fetchReadingList = async () => {
    try {
      const response = await fetch('/api/reading-list?userId=test-user-1');
      if (!response.ok) {
        throw new Error('Failed to fetch reading list');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching reading list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/reading-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newItem,
          userId: 'test-user-1',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reading list item');
      }

      const addedItem = await response.json();
      setItems(prev => [...prev, addedItem]);
      setNewItem({ title: '', content: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding reading list item:', error);
      alert('Failed to add reading list item. Please try again.');
    }
  };

  const handleEdit = async () => {
    if (!editingId || !editingItem) return;

    try {
      const response = await fetch('/api/reading-list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingId,
          title: editingItem.title,
          content: editingItem.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reading list item');
      }

      const updatedItem = await response.json();
      setItems(prev => prev.map(item => 
        item.id === editingId ? updatedItem : item
      ));
      setEditingId(null);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating reading list item:', error);
      alert('Failed to update reading list item. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/reading-list?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reading list item');
      }

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting reading list item:', error);
      alert('Failed to delete reading list item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reading List</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Add New Item */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Reading Item</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newItem.content}
                onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter content"
                rows={4}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newItem.title || !newItem.content}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Reading List Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Your Reading List</h2>
          {isLoading ? (
            <div className="text-center text-gray-500">Loading reading list...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500">No reading items yet. Add some to get started!</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  {editingId === item.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingItem?.title}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <textarea
                        value={editingItem?.content}
                        onChange={(e) => setEditingItem(prev => prev ? { ...prev, content: e.target.value } : null)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
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
                            setEditingItem(null);
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{item.title}</h3>
                          <p className="text-gray-600 mt-2 whitespace-pre-wrap">{item.content}</p>
                          <div className="text-sm text-gray-500 mt-2">
                            Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditingItem(item);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
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