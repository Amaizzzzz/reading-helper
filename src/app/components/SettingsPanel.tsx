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
        <span>Beginner</span>
        <span>Expert</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Language Skills Settings */}
      <div className="space-y-6">
        {renderSkillSlider('readingLevel', 'Reading Level', '📚')}
        {renderSkillSlider('listeningLevel', 'Listening Comprehension', '👂')}
      </div>
      <div className="space-y-6">
        {renderSkillSlider('speakingLevel', 'Speaking', '🗣')}
        {renderSkillSlider('writingLevel', 'Writing', '✍️')}
      </div>

      {/* Translation Density Settings */}
      <div className="col-span-2 pt-4 border-t border-gray-100">
        {renderSkillSlider('translationDensity', 'Translation Hint Density', '🔍')}
        <p className="mt-2 text-xs text-gray-500">
          Tip: Adjust this option to control the amount of text that needs translation and explanation
        </p>
      </div>

      {/* Save Button */}
      <button
        className="col-span-2 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600
                   hover:from-blue-600 hover:to-blue-700
                   text-white text-sm font-medium rounded-xl
                   shadow-sm hover:shadow transition-all
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        onClick={() => {
          // TODO: Save settings to local storage or backend
          console.log('Settings saved:', localSettings);
        }}
      >
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPanel; 