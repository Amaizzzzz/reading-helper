'use client';

import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState({
    readingLevel: 50,
    listeningLevel: 50,
    speakingLevel: 50,
    writingLevel: 50,
    translationDensity: 50,
  });

  const handleSettingChange = (setting: keyof typeof localSettings, value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const renderSkillSlider = (
    skill: keyof typeof localSettings,
    label: string,
    icon: string
  ) => (
    <div className="relative group">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </label>
        <span className="text-sm font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
          {localSettings[skill]}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={localSettings[skill]}
        onChange={(e) => handleSettingChange(skill, parseInt(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer
                   accent-blue-500 hover:accent-blue-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>初学者</span>
        <span>专家</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* 语言技能设置 */}
      <div className="space-y-6">
        {renderSkillSlider('readingLevel', '阅读能力', '📚')}
        {renderSkillSlider('listeningLevel', '听力理解', '👂')}
      </div>
      <div className="space-y-6">
        {renderSkillSlider('speakingLevel', '口语表达', '🗣')}
        {renderSkillSlider('writingLevel', '写作能力', '✍️')}
      </div>

      {/* 翻译密度设置 */}
      <div className="col-span-2 pt-4 border-t border-gray-100">
        {renderSkillSlider('translationDensity', '翻译提示密度', '🔍')}
        <p className="mt-2 text-xs text-gray-500">
          提示：调整此选项可以控制需要翻译和解释的文本数量
        </p>
      </div>

      {/* 保存按钮 */}
      <button
        className="col-span-2 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600
                   hover:from-blue-600 hover:to-blue-700
                   text-white text-sm font-medium rounded-xl
                   shadow-sm hover:shadow transition-all
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        onClick={() => {
          // TODO: 保存设置到本地存储或后端
          console.log('Settings saved:', localSettings);
        }}
      >
        保存设置
      </button>
    </div>
  );
};

export default SettingsPanel; 