'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from './contexts/SettingsContext';
import InteractiveReader from './components/InteractiveReader';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlashcardData } from './types/flashcard';

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const [userInput, setUserInput] = useState('');
  const pathname = usePathname();
  const [selectedFlashcard, setSelectedFlashcard] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: 'How can I help you understand?' }
  ]);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        // Fetch all flashcards (backend sorting might be needed for true recency)
        const response = await fetch('/api/flashcards?userId=test-user-1'); 
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards');
        }
        const allFlashcards: FlashcardData[] = await response.json();
        
        // Sort by dateAdded descending (assuming dateAdded exists and is reliable)
        // Note: For performance, ideally sort on the backend
        const sortedFlashcards = allFlashcards.sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        
        // Keep only the top 3
        setFlashcards(sortedFlashcards.slice(0, 3)); 
        
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setFlashcards([]); // Set to empty on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMessage = userInput.trim();
    setUserInput('');
    
    // Add user message to chat
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add assistant response to chat
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
  };

  const handleSaveToReadingList = async () => {
    if (!selectedText) return;

    try {
      const response = await fetch('/api/reading-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedText.substring(0, 50) + '...', // First 50 chars as title
          content: selectedText,
          userId: 'test-user-1',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to reading list');
      }

      setSelectedText('');
      setShowTranslation(false);
      alert('Saved to reading list!');
    } catch (error) {
      console.error('Error saving to reading list:', error);
      alert('Failed to save to reading list. Please try again.');
    }
  };

  const handleAddToFlashcards = async () => {
    if (!selectedText) return;

    try {
      // First check if the word already exists in flashcards
      const response = await fetch(`/api/flashcards/check?word=${encodeURIComponent(selectedText)}&userId=test-user-1`);
      const { exists } = await response.json();

      if (exists) {
        alert('This word is already in your review list!');
        return;
      }

      // If not a duplicate, add to flashcards
      const addResponse = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: selectedText,
          userId: 'test-user-1',
        }),
      });

      if (!addResponse.ok) {
        throw new Error('Failed to add to flashcards');
      }

      const newFlashcard = await addResponse.json();
      setFlashcards(prev => [...prev, newFlashcard]);
      setSelectedText('');
      setShowTranslation(false);
      alert('Added to review list!');
    } catch (error) {
      console.error('Error adding to flashcards:', error);
      alert('Failed to add to review list. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-bold p-4">AIReader+</h1>
          <div className="border-b border-gray-200">
            <nav className="flex px-4 pb-2 space-x-6">
              <Link 
                href="/" 
                className={`${pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'} pb-2`}
              >
                Home
              </Link>
              <Link 
                href="/reading-list" 
                className={`${pathname === '/reading-list' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'} pb-2`}
              >
                Reading List
              </Link>
              <Link 
                href="/flashcards" 
                className={`${pathname === '/flashcards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'} pb-2`}
              >
                Flashcards
              </Link>
              <Link 
                href="/settings" 
                className={`${pathname === '/settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'} pb-2`}
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto flex min-h-[calc(100vh-120px)]">
        {/* Left Panel */}
        <div className="flex-1 min-w-0 bg-white border-r border-gray-200 p-6">
          <InteractiveReader
            title="Learning Content"
            content="This is a sample text for testing the translation and flashcard features. Select any word or phrase to see its translation and add it to your flashcards. The quick brown fox jumps over the lazy dog."
            articleId="default"
          />
        </div>

        {/* Right Panel */}
        <div className="w-[320px] bg-white">
          <div className="p-6 space-y-6">
            {/* Learning Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">Learning Assistance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Hint Level</span>
                    <span className="font-medium text-blue-600">Level {Math.ceil(settings.hintLevel / 20)}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="25"
                      value={settings.hintLevel}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        console.log(`>>> Slider Change: Hint Level attempting to set to ${newValue}`); // DEBUG LOG
                        updateSettings({ ...settings, hintLevel: newValue });
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="absolute w-full flex justify-between px-1 top-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`w-2 h-2 rounded-full transition-colors ${
                            level <= Math.ceil(settings.hintLevel / 20) 
                              ? 'bg-blue-600' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute w-full flex justify-between px-1 top-6 text-xs text-gray-500">
                      <span>Basic</span>
                      <span>Detailed</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Translation Detail</span>
                    <span className="font-medium text-blue-600">Level {Math.ceil(settings.translationDetail / 20)}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="25"
                      value={settings.translationDetail}
                      onChange={(e) => {
                        const newValue = Number(e.target.value);
                        console.log(`>>> Slider Change: Translation Detail attempting to set to ${newValue}`); // DEBUG LOG
                        updateSettings({ ...settings, translationDetail: newValue });
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="absolute w-full flex justify-between px-1 top-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`w-2 h-2 rounded-full transition-colors ${
                            level <= Math.ceil(settings.translationDetail / 20) 
                              ? 'bg-blue-600' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute w-full flex justify-between px-1 top-6 text-xs text-gray-500">
                      <span>Simple</span>
                      <span>Comprehensive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flashcards */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Review Words</h3>
                <Link 
                  href="/flashcards"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Review All ({/* Optionally show total count here if fetched */})
                </Link>
              </div>
              {isLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : flashcards.length === 0 ? (
                <div className="text-center text-gray-500">No words added yet.</div>
              ) : (
                <ul className="space-y-2">
                  {flashcards.map((card) => (
                    <li key={card.id} className="p-3 bg-gray-50 rounded-md shadow-sm">
                      <div className="font-medium">{card.word}</div>
                      {/* Optional: Show translation or date added */}
                      {/* <div className="text-sm text-gray-500">Added: {new Date(card.dateAdded).toLocaleDateString()}</div> */}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* AI Chat */}
            <div>
              <h3 className="text-lg font-medium mb-4">AI Language Assistant</h3>
              <div className="space-y-4">
                <div className="h-[240px] overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-4 bg-gray-50">
                  {aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded ${
                        msg.role === 'assistant' ? 'bg-white' : 'bg-blue-50 ml-auto'
                      } max-w-[80%]`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your question..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTranslation && selectedText && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Selected Text</h3>
            <button
              onClick={() => {
                setShowTranslation(false);
                setSelectedText('');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <p className="text-gray-700 mb-4">{selectedText}</p>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveToReadingList}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Save to Reading List
            </button>
            <button
              onClick={handleAddToFlashcards}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add to Flashcards
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 