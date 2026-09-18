import React from 'react';
import type { VideoInfo } from '../types';
import { formatDuration } from '../utils/helpers';

interface VideoPreviewProps {
  videoInfo: VideoInfo;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videoInfo }) => {
  return (
    <div className="card animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-64 aspect-video rounded-lg overflow-hidden bg-surface-secondary-light dark:bg-surface-secondary-dark flex-shrink-0">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-full h-full object-cover"
          />
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-medium text-white">
            {formatDuration(videoInfo.duration)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark line-clamp-2 mb-2">
            {videoInfo.title}
          </h2>
          
          {videoInfo.channel && (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
              {videoInfo.channel}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>YouTube</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDuration(videoInfo.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
