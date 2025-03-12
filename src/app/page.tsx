'use client';

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import ReadingSection from './components/ReadingSection';

export default function Home() {
  const { settings, updateSettings } = useSettings();
  const [userInput, setUserInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: '有什么我可以帮你理解的吗？' }
  ]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-bold p-4">语境学习助手</h1>
          <div className="border-b border-gray-200">
            <nav className="flex px-4 pb-2 space-x-6">
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-2">首页</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">我的学习</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">错题集</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">设置</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto flex min-h-[calc(100vh-120px)]">
        {/* Left Panel */}
        <div className="flex-1 min-w-0 bg-white border-r border-gray-200 p-6">
          <ReadingSection
            title="学习内容"
            content=""
            articleId="default"
          />
        </div>

        {/* Right Panel */}
        <div className="w-[320px] bg-white">
          <div className="p-6 space-y-6">
            {/* Learning Settings */}
            <div>
              <h3 className="text-lg font-medium mb-4">学习辅助调节</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>提示级别</span>
                    <span>低 - 高</span>
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
                    <span>翻译详细度</span>
                    <span>简洁 - 详细</span>
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
              <h3 className="text-lg font-medium mb-4">我的错题集</h3>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                  前所未有
                </div>
                <div className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                  滥用
                </div>
              </div>
            </div>

            {/* AI Chat */}
            <div>
              <h3 className="text-lg font-medium mb-4">AI语言助手</h3>
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
                    placeholder="输入问题..."
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    发送
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