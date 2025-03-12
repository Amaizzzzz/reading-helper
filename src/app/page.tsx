'use client';

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import TranslationPopup from './components/TranslationPopup';

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const [selectedText, setSelectedText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationPosition, setTranslationPosition] = useState({ x: 0, y: 0 });
  const [userInput, setUserInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: '有什么我可以帮你理解的吗？' }
  ]);

  const handleTextSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    const text = window.getSelection()?.toString();
    if (text) {
      setSelectedText(text);
      setTranslationPosition({ x: e.pageX, y: e.pageY });
      setShowTranslation(true);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    setAiMessages(prev => [
      ...prev,
      { role: 'user', content: userInput },
      { role: 'assistant', content: `这是对"${userInput}"的回答...` }
    ]);
    setUserInput('');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - 3/4 width */}
      <div className="w-3/4 bg-gray-50 min-h-screen p-8 overflow-auto">
        {/* Text Input Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>输入学习内容</span>
          </h2>
          <textarea
            className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="在这里粘贴或输入要学习的文本..."
          />
        </div>

        {/* Reading Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="prose max-w-none" onMouseUp={handleTextSelection}>
            <p className="mb-4">
              近年来，人工智能技术的<span className="highlight">飞速发展</span>引起了全球范围内的广泛关注。
              从语言模型到计算机视觉，从自动驾驶到医疗诊断，人工智能正在各个领域展现出<span className="highlight">前所未有</span>的潜力。
            </p>
            <p className="mb-4">
              大型语言模型（LLMs）的<span className="highlight">出现</span>使机器能够理解和生成人类语言，
              这为人机交互带来了革命性的变化。
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - 1/4 width */}
      <div className="w-1/4 bg-white border-l border-gray-200 min-h-screen flex flex-col">
        <div className="p-6 flex-1">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>🤖</span>
            <span>AI助手</span>
          </h2>
          <div className="flex flex-col h-[calc(100%-4rem)]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl ${
                    msg.role === 'assistant'
                      ? 'bg-gray-50'
                      : 'bg-blue-50 ml-auto'
                  } max-w-[80%] ${
                    msg.role === 'user' ? 'ml-auto' : ''
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-4 border-t border-gray-100 bg-white">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入问题..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTranslation && (
        <TranslationPopup
          text={selectedText}
          position={translationPosition}
          onClose={() => setShowTranslation(false)}
        />
      )}
    </div>
  );
} 