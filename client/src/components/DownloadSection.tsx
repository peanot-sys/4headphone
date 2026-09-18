import React from 'react';
import type { ProcessingStatus } from '../types';

interface DownloadSectionProps {
  mediaType: 'video' | 'audio';
  format: string;
  quality: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: ProcessingStatus;
  onDownload: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  mediaType,
  format,
  quality,
  startTime,
  endTime,
  duration,
  status,
  onDownload,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        Your Download
      </h3>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Type</p>
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark capitalize">{mediaType}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Format</p>
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark uppercase">{format.split('-')[0]}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Quality</p>
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{quality}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Duration</p>
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{formatTime(duration)}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Start</p>
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{formatTime(startTime)}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">End</p>
          <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{formatTime(endTime)}</p>
        </div>
      </div>

      {/* Status and Action */}
      {status.status === 'processing' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary-light dark:text-text-secondary-dark">{status.message}</span>
            <span className="text-text-primary-light dark:text-text-primary-dark font-medium">{Math.round(status.progress || 0)}%</span>
          </div>
          <div className="h-2 bg-surface-secondary-light dark:bg-surface-secondary-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${status.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {status.status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{status.error}</p>
        </div>
      )}

      {status.status === 'completed' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{status.message}</span>
          </div>
        </div>
      )}

      {status.status !== 'processing' && status.status !== 'completed' && (
        <button onClick={onDownload} className="btn-primary w-full flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      )}
    </div>
  );
};
