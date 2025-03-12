'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 'reading',
    label: '阅读学习',
    icon: '📚',
    href: '/reading'
  },
  {
    id: 'practice',
    label: '练习模式',
    icon: '✍️',
    href: '/practice'
  },
  {
    id: 'mistakes',
    label: '错题集',
    icon: '📝',
    href: '/mistakes'
  },
  {
    id: 'vocabulary',
    label: '生词本',
    icon: '📖',
    href: '/vocabulary'
  }
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent 
                             group-hover:from-blue-500 group-hover:to-blue-300 transition-all">
                语境学习助手
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:block">
            <div className="flex items-center space-x-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`
                      px-5 py-3 rounded-2xl text-sm font-medium
                      flex items-center space-x-2.5 group relative
                      transition-all duration-200 ease-out
                      ${
                        isActive
                          ? 'bg-white shadow-sm text-blue-600'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-white/60'
                      }
                    `}
                  >
                    <span className="text-lg transform group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-[1.5px] left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 
                                    rounded-full transform origin-left" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-gray-500
                         hover:text-gray-600 hover:bg-gray-100/80 
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20
                         transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">打开主菜单</span>
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`sm:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  block px-5 py-3 rounded-2xl text-base font-medium
                  flex items-center space-x-3 transition-all duration-200
                  ${
                    isActive
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white/60'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 