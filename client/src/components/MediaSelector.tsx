import React from 'react';
import type { MediaType } from '../types';

interface MediaSelectorProps {
  mediaType: MediaType;
  onChange: (type: MediaType) => void;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({ mediaType, onChange }) => {
  return (
    <div className="inline-flex p-1 bg-surface-secondary-light dark:bg-surface-secondary-dark rounded-xl">
      <button
        onClick={() => onChange('video')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          mediaType === 'video'
            ? 'bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark shadow-sm'
            : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Video
      </button>
      <button
        onClick={() => onChange('audio')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          mediaType === 'audio'
            ? 'bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark shadow-sm'
            : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        Audio
      </button>
    </div>
  );
};
