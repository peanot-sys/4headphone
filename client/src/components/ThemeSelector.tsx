import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { themeMode, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-48 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg p-2 animate-fade-in">
        <button
          onClick={() => { setTheme('light'); onClose(); }}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            themeMode === 'light'
              ? 'bg-accent text-white'
              : 'text-text-primary-light dark:text-text-primary-dark hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark'
          }`}
        >
          ☀️ Light
        </button>
        <button
          onClick={() => { setTheme('dark'); onClose(); }}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            themeMode === 'dark'
              ? 'bg-accent text-white'
              : 'text-text-primary-light dark:text-text-primary-dark hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark'
          }`}
        >
          🌙 Dark
        </button>
        <button
          onClick={() => { setTheme('system'); onClose(); }}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            themeMode === 'system'
              ? 'bg-accent text-white'
              : 'text-text-primary-light dark:text-text-primary-dark hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark'
          }`}
        >
          ⚙️ System
        </button>
      </div>
    </>
  );
};
