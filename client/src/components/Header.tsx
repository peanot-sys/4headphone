import React, { useState } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { themeMode } = useTheme();

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      default: return '⚙️';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              Media Downloader
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme selector */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark transition-colors"
                aria-label="Toggle theme"
              >
                <span className="text-lg">{getThemeIcon()}</span>
              </button>
              <ThemeSelector isOpen={themeMenuOpen} onClose={() => setThemeMenuOpen(false)} />
            </div>

            {/* Settings icon */}
            <button
              className="p-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark transition-colors"
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
