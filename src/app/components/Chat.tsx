'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, ChatMessage } from '../../types/chat';
import { FlashcardData } from '../../types/flashcard';
import { createMessage, generateResponse, updateChatContext } from '../../utils/chatManager';

interface ChatProps {
  session: ChatSession;
  onUpdateSession: (session: ChatSession) => void;
  onCreateFlashcard: (card: FlashcardData) => void;
}

const Chat: React.FC<ChatProps> = ({
  session,
  onUpdateSession,
  onCreateFlashcard
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = createMessage('user', inputValue);
    const updatedSession = {
      ...session,
      messages: [...session.messages, userMessage],
      lastUpdated: new Date().toISOString()
    };
    onUpdateSession(updatedSession);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await generateResponse(
        inputValue,
        session.context,
        session.languagePair
      );

      // Add any suggested flashcards
      response.suggestedFlashcards?.forEach(card => {
        onCreateFlashcard(card);
      });

      // Update context with any new information
      const newSession = updateChatContext(
        {
          ...updatedSession,
          messages: [...updatedSession.messages, response]
        },
        {
          lastInteractionTime: new Date().toISOString(),
          recentFlashcards: [
            ...session.context.recentFlashcards,
            ...(response.suggestedFlashcards || [])
          ].slice(-5)
        }
      );

      onUpdateSession(newSession);
    } catch (error) {
      console.error('Failed to generate response:', error);
      const errorMessage = createMessage(
        'system',
        'Sorry, I encountered an error. Please try again.'
      );
      onUpdateSession({
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage]
      });
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-4 ${
            isSystem
              ? 'bg-gray-100 text-gray-700'
              : isUser
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="text-sm mb-1">
            {message.content}
          </div>

          {message.grammarPoints && message.grammarPoints.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium mb-2">
                Grammar Points:
              </div>
              {message.grammarPoints.map((point, index) => (
                <div key={index} className="text-xs mb-2">
                  <div className="font-medium">{point.explanation}</div>
                  <div className="text-gray-600">
                    {point.examples[0]}
                  </div>
                </div>
              ))}
            </div>
          )}

          {message.relatedWords && message.relatedWords.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium mb-2">
                Related Words:
              </div>
              <div className="flex flex-wrap gap-2">
                {message.relatedWords.map((word, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 rounded"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {message.suggestedFlashcards && message.suggestedFlashcards.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium mb-2">
                Suggested Flashcards:
              </div>
              <div className="space-y-2">
                {message.suggestedFlashcards.map((card, index) => (
                  <div
                    key={index}
                    className="text-xs p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => onCreateFlashcard(card)}
                  >
                    <span className="font-medium">{card.word}</span>
                    <span className="mx-2">-</span>
                    <span>{card.translation.translation.basic.translation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map(renderMessage)}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t p-4 bg-white"
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`px-6 py-2 rounded-lg ${
              !inputValue.trim() || isTyping
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 