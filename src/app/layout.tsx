import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SettingsProvider } from '../contexts/SettingsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '语境学习助手',
  description: '智能语言学习辅助工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
