'use client';

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import InteractiveReader from './components/InteractiveReader';

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const [userInput, setUserInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: 'How can I help you understand?' }
  ]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-bold p-4">AIReader+</h1>
          <div className="border-b border-gray-200">
            <nav className="flex px-4 pb-2 space-x-6">
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-2">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Reading List</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Saved Notes</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Settings</a>
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
            content=""
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
                    <span>Low - High</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.hintLevel}
                    onChange={(e) => updateSettings({ ...settings, hintLevel: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Translation Detail</span>
                    <span>Brief - Detailed</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.translationDetail}
                    onChange={(e) => updateSettings({ ...settings, translationDetail: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Flashcards */}
            <div>
              <h3 className="text-lg font-medium mb-4">My Review List</h3>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                  unprecedented
                </div>
                <div className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                  abuse
                </div>
              </div>
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Enter your question..."
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 