'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
}

interface UserPreferences {
  hintLevel: number;
  translationDetail: number;
}

interface TranslationResult {
  hint: string;
  translation: string;
}

export default function ArticlePage() {
  const params = useParams();
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [isInReviewList, setIsInReviewList] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    hintLevel: 50,
    translationDetail: 50
  });
  const [selectedText, setSelectedText] = useState<string>('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    // Fetch user preferences
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences');
        if (!response.ok) {
          throw new Error('Failed to fetch preferences');
        }
        const data = await response.json();
        setPreferences(data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, []);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchArticle = async () => {
      try {
        // Simulated article data
        const articleData: Article = {
          id: params.id as string,
          title: 'The Impact of Technology on Modern Society',
          content: `Technology has transformed the way we live, work, and communicate. From smartphones to artificial intelligence, our daily lives are increasingly shaped by technological innovations.

          The rapid pace of technological change has brought both opportunities and challenges. While it has made many aspects of life more convenient, it has also raised concerns about privacy, security, and social interaction.

          As we continue to advance technologically, it's important to consider the ethical implications and ensure that technology serves humanity's best interests.`,
          author: 'John Doe',
          date: '2024-03-18',
          readingTime: '5 min read'
        };
        setArticle(articleData);
      } catch (err) {
        setError('Failed to load article');
        console.error('Error loading article:', err);
      }
    };

    fetchArticle();
  }, [params.id]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';
    setSelectedText(selectedText);
    setShowTranslation(false);
  };

  const handleProcessText = async () => {
    if (!selectedText) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selectedText,
          hintLevel: preferences.hintLevel,
          translationDetail: preferences.translationDetail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process text');
      }

      const data = await response.json();
      
      if (!data.hint || !data.translation) {
        throw new Error('Invalid response from server');
      }

      setTranslation(data);
      setShowTranslation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process text');
      console.error('Error processing text:', err);
      setTranslation(null);
      setShowTranslation(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveNote = () => {
    setIsNoteSaved(!isNoteSaved);
    // In a real app, this would save the note to a database
  };

  const handleAddToReview = () => {
    setIsInReviewList(!isInReviewList);
    // In a real app, this would add the article to the user's review list
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <Link 
            href="/reading-list"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Reading List
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-[800px] mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/reading-list"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Reading List
          </Link>
        </div>
        
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">{article.title}</h1>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6 space-x-4">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readingTime}</span>
          </div>

          <div 
            className="prose dark:prose-invert max-w-none"
            onMouseUp={handleTextSelection}
          >
            {article.content.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>

          {/* Translation Panel */}
          {selectedText && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium dark:text-white">Selected Text</h3>
                <button
                  onClick={handleProcessText}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors duration-200`}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Translate'}
                </button>
              </div>
              <p className="text-gray-800 dark:text-gray-200 mb-4">{selectedText}</p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}
              
              {showTranslation && translation && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Hint</h4>
                    <p className="text-gray-800 dark:text-gray-200">{translation.hint}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Translation</h4>
                    <p className="text-gray-800 dark:text-gray-200">{translation.translation}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleSaveNote}
              className={`px-4 py-2 rounded-lg ${
                isNoteSaved
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              }`}
            >
              {isNoteSaved ? 'Note Saved' : 'Save Note'}
            </button>
            <button
              onClick={handleAddToReview}
              className={`px-4 py-2 rounded-lg ${
                isInReviewList
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              }`}
            >
              {isInReviewList ? 'Added to Review List' : 'Add to Review List'}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}