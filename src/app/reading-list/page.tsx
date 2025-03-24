'use client';

import React from 'react';
import Link from 'next/link';

export default function ReadingList() {
  const articles = [
    {
      id: '1',
      title: 'The Impact of Technology on Modern Society',
      lastRead: '2 days ago',
      content: `Technology has transformed the way we live, work, and communicate. From smartphones to artificial intelligence, our daily lives are increasingly shaped by technological innovations.

      The rapid pace of technological change has brought both opportunities and challenges. While it has made many aspects of life more convenient, it has also raised concerns about privacy, security, and social interaction.

      As we continue to advance technologically, it's important to consider the ethical implications and ensure that technology serves humanity's best interests.`,
      author: 'John Doe',
      date: '2024-03-18',
      readingTime: '5 min read'
    },
    {
      id: '2',
      title: 'Understanding Climate Change',
      lastRead: '1 week ago',
      content: `Climate change is one of the most pressing challenges facing our planet today. The scientific evidence is clear: global temperatures are rising, and human activity is the primary driver.

      The effects of climate change are already being felt around the world, from extreme weather events to rising sea levels. Understanding these changes is crucial for developing effective solutions.

      This article explores the science behind climate change and discusses potential strategies for mitigation and adaptation.`,
      author: 'Jane Smith',
      date: '2024-03-13',
      readingTime: '7 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold">Reading List</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {articles.map((article) => (
              <Link 
                key={article.id}
                href={`/article/${article.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-medium">{article.title}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readingTime}</span>
                  <span>•</span>
                  <span>Last read: {article.lastRead}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 