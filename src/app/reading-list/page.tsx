'use client';

import React from 'react';
import Link from 'next/link';

export default function ReadingList() {
  const articles = [
    {
      id: '1',
      title: 'Article Title 1',
      lastRead: '2 days ago',
      content: 'This is the content of article 1...'
    },
    {
      id: '2',
      title: 'Article Title 2',
      lastRead: '1 week ago',
      content: 'This is the content of article 2...'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Reading List</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {articles.map((article) => (
              <Link 
                key={article.id}
                href={`/article/${article.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-medium">{article.title}</h2>
                <p className="text-gray-600">Last read: {article.lastRead}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 