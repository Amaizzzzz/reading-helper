'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id;
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // This would typically come from your database
  const article = {
    id: articleId,
    title: 'Sample Article Title',
    content: `This is a sample article content. It can contain multiple paragraphs and detailed information.
    
    The article can include various sections and formatting.
    
    You can add more content here as needed.`,
    author: 'Author Name',
    date: '2024-03-20',
    readingTime: '5 min read'
  };

  const handleSaveNote = () => {
    setShowNoteModal(true);
  };

  const handleAddToReviewList = () => {
    // Here you would typically make an API call to save to review list
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleSubmitNote = () => {
    // Here you would typically make an API call to save the note
    setShowNoteModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/reading-list"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Reading List
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <span>{article.author}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
            </div>
          </header>

          <div className="prose max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Interactive Features */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold mb-4">Interactive Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleSaveNote}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-medium mb-2">Save Note</h3>
                <p className="text-sm text-gray-600">Add your thoughts about this article</p>
              </button>
              <button 
                onClick={handleAddToReviewList}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <h3 className="font-medium mb-2">Add to Review List</h3>
                <p className="text-sm text-gray-600">Save words for later review</p>
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Save Note</h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg mb-4"
              placeholder="Enter your notes here..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Action completed successfully!
        </div>
      )}
    </div>
  );
} 