import React, { useState } from 'react';
import { isValidYouTubeUrl } from '../utils/helpers';

interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      await onAnalyze(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze video');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch {
      setError('Unable to access clipboard');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex gap-2 p-2 bg-surface-light dark:bg-surface-dark border rounded-xl transition-all duration-200 ${
          error 
            ? 'border-red-500 dark:border-red-400' 
            : 'border-border-light dark:border-border-dark focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20'
        }`}>
          <div className="flex items-center pl-3">
            <svg className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="Paste YouTube URL"
            className="flex-1 bg-transparent py-3 px-2 text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={handlePaste}
            className="px-3 py-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
            disabled={isLoading}
          >
            Paste
          </button>

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 animate-fade-in">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};
