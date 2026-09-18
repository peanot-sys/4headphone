import React, { useState, useRef } from 'react';
import { formatDuration } from '../utils/helpers';

interface PreviewPlayerProps {
  videoId: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  videoId,
  duration,
  startTime,
  endTime,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Create embed URL with start time
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(startTime)}&end=${Math.floor(endTime)}`;

  const handlePlayPause = () => {
    if (!playerRef.current?.contentWindow) return;
    
    if (isPlaying) {
      playerRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
        args: []
      }), '*');
    } else {
      playerRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: []
      }), '*');
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="card">
      <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
        <iframe
          ref={playerRef}
          src={embedUrl}
          title="Video preview"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoadedData={() => setCurrentTime(startTime)}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayPause}
          className="p-3 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="text-sm font-mono text-text-secondary-light dark:text-text-secondary-dark">
            {formatDuration(currentTime)} / {formatDuration(endTime - startTime)}
          </div>
        </div>

        <button
          onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}
          className="p-2.5 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-surface-secondary-light dark:hover:bg-surface-secondary-dark transition-colors"
          title="Open on YouTube"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </div>
  );
};
