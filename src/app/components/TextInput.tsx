'use client';

import React, { useState } from 'react';

interface TextInputProps {
  onSelect?: (e: MouseEvent) => void;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ onSelect, className }) => {
  const [text, setText] = useState('');

  const handleMouseUp = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(e as unknown as MouseEvent);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onMouseUp={handleMouseUp}
        placeholder="在这里粘贴或输入要学习的文本..."
        className={`w-full min-h-[300px] p-6 resize-y bg-white/80 
                   backdrop-blur-sm rounded-xl border-0
                   focus:ring-2 focus:ring-blue-500/30
                   text-gray-700 leading-relaxed
                   placeholder:text-gray-400
                   ${className || ''}`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          fontSize: '16px',
          letterSpacing: '0.3px',
        }}
      />
      <div className="flex justify-between items-center px-2">
        <span className="text-sm text-gray-500">
          选中文本可查看翻译和解释
        </span>
        <span className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
          {text.length} 字
        </span>
      </div>
    </div>
  );
};

export default TextInput; 