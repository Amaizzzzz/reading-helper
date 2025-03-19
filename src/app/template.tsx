import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AIReader+',
  description: 'AI-powered reading assistant for enhanced text understanding',
};

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 