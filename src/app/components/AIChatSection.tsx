'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AIChatSectionProps {
  onSendMessage: (message: string) => void;
}

const AIChatSection: React.FC<AIChatSectionProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 自动调整文本框高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setIsTyping(true);
      onSendMessage(message);
      setMessage('');
      setIsTyping(false);
    }
  };

  const suggestions = [
    { text: '这个词的具体用法是什么？', icon: '💭' },
    { text: '可以给我更多例句吗？', icon: '📝' },
    { text: '如何记忆这个词？', icon: '🧠' },
    { text: '相似词有哪些？', icon: '🔄' }
  ];

  return (
    <div className="ai-chat-section">
      <div className="section-title">
        <span className="text-3xl">🤖</span>
        <span>AI 学习助手</span>
      </div>

      <div className="bg-white/50 rounded-xl p-6 space-y-4">
        <p className="text-gray-600">
          你可以问我任何关于这段内容的问题，比如：
        </p>
        <div className="flex flex-wrap gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setMessage(suggestion.text);
                inputRef.current?.focus();
              }}
              className="button-secondary group relative"
            >
              <span className="text-xl mr-2">{suggestion.icon}</span>
              {suggestion.text}
              <div className="tooltip">点击快速提问</div>
            </button>
          ))}
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="relative">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          placeholder="输入你的问题，按 Enter 发送，Shift + Enter 换行..."
          className="input-base min-h-[60px] max-h-[200px] py-4 pr-[100px]"
          disabled={isTyping}
        />
        <button
          type="submit"
          className="button-primary absolute right-2 bottom-2 !min-w-[90px]"
          disabled={!message.trim() || isTyping}
        >
          {isTyping ? (
            <>
              <span className="animate-spin text-xl mr-2">⏳</span>
              处理中
            </>
          ) : (
            <>
              <span className="text-xl">📤</span>
              <span>发送</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AIChatSection; 