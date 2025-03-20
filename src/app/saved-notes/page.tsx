'use client';

import React, { useState } from 'react';

export default function SavedNotes() {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  
  const notes = [
    {
      id: '1',
      title: 'Note Title 1',
      created: '2 days ago',
      content: 'This is the content of note 1. It can contain multiple paragraphs and detailed information about what you learned from the article.'
    },
    {
      id: '2',
      title: 'Note Title 2',
      created: '1 week ago',
      content: 'This is the content of note 2. You can add your thoughts, important points, and any other relevant information here.'
    }
  ];

  const toggleNote = (noteId: string) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Saved Notes</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => toggleNote(note.id)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">{note.title}</h2>
                  <span className="text-sm text-gray-500">
                    {expandedNote === note.id ? '▼' : '▶'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">Created: {note.created}</p>
                {expandedNote === note.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 