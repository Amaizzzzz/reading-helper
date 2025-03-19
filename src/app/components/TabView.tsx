'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode[];
}

const TabView: React.FC<TabViewProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="tab-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {React.Children.map(children, (child, index) => (
          <div
            className={`tab-content absolute inset-0 ${
              tabs[index]?.id === activeTab ? 'active' : 'pointer-events-none'
            }`}
            style={{ display: tabs[index]?.id === activeTab ? 'block' : 'none' }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabView; 