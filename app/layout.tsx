'use client';

import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { LearningSettingsProvider } from './contexts/LearningSettingsContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage for dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <body className={`${inter.className} transition-colors duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <SettingsProvider>
          <LearningSettingsProvider>
            {children}
          </LearningSettingsProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
