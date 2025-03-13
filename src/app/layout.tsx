import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SettingsProvider } from '../contexts/SettingsContext';
import { LearningSettingsProvider } from '../contexts/LearningSettingsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIReader+',
  description: 'AI-powered reading assistant for enhanced text understanding',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          <LearningSettingsProvider>
            {children}
          </LearningSettingsProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
