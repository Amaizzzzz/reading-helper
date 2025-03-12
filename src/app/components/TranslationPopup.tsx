'use client';

import React, { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface TranslationPopupProps {
  text: string;
  position: Position;
  onClose: () => void;
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
  text,
  position,
  onClose,
}) => {
  const [translation, setTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // 模拟翻译API调用
    setTranslation(`"${text}" 的翻译`);
    setSuggestions([
      '📚 词义解释',
      '🔤 相关词汇',
      '📝 例句',
      '💡 记忆技巧'
    ]);
  }, [text]);

  return (
    <div
      className="fixed z-50 w-80"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`
      }}
    >
      <div className="mac-card p-4 space-y-4">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* 翻译内容 */}
        <div>
          <div className="text-sm text-gray-500 mb-1">选中文本：</div>
          <div className="font-medium text-gray-800">{text}</div>
          <div className="text-blue-600 mt-2">{translation}</div>
        </div>

        {/* 学习建议 */}
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="p-2 text-sm text-gray-600 bg-gray-50 rounded-lg
                         hover:bg-blue-50 hover:text-blue-600 transition-colors
                         flex items-center justify-center space-x-2"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* 添加到生词本 */}
        <button
          className="w-full p-2 text-sm bg-blue-50 text-blue-600 rounded-lg
                     hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
        >
          <span>📖</span>
          <span>添加到生词本</span>
        </button>
      </div>
    </div>
  );
};

export default TranslationPopup; 