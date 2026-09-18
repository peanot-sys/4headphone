import React, { useState, useRef, useCallback } from 'react';
import { formatDuration, clamp } from '../utils/helpers';

interface TimelineProps {
  duration: number;
  startTime: number;
  endTime: number;
  onTimeChange: (start: number, end: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  duration,
  startTime,
  endTime,
  onTimeChange,
}) => {
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const getPositionFromTime = useCallback((time: number) => {
    return (time / duration) * 100;
  }, [duration]);

  const getTimeFromPosition = useCallback((clientX: number) => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    return clamp(position * duration, 0, duration);
  }, [duration]);

  const handleMouseDown = (type: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleTouchStart = (type: 'start' | 'end') => (e: React.TouchEvent) => {
    setIsDragging(type);
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    
    const newTime = getTimeFromPosition(clientX);
    
    if (isDragging === 'start') {
      const newStart = clamp(newTime, 0, endTime - 1);
      onTimeChange(newStart, endTime);
    } else {
      const newEnd = clamp(newTime, startTime + 1, duration);
      onTimeChange(startTime, newEnd);
    }
  }, [isDragging, startTime, endTime, duration, getTimeFromPosition, onTimeChange]);

  const handleUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Global event listeners for drag
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleMove, handleUp]);

  const selectedDuration = endTime - startTime;
  const startPercent = getPositionFromTime(startTime);
  const endPercent = getPositionFromTime(endTime);

  return (
    <div className="w-full">
      {/* Timeline */}
      <div
        ref={timelineRef}
        className="relative h-12 bg-surface-secondary-light dark:bg-surface-secondary-dark rounded-lg cursor-pointer select-none"
        onClick={(e) => {
          const time = getTimeFromPosition(e.clientX);
          const midPoint = (startTime + endTime) / 2;
          if (time < midPoint && time < startTime) {
            onTimeChange(time, endTime);
          } else if (time > midPoint && time > endTime) {
            onTimeChange(startTime, time);
          }
        }}
      >
        {/* Track */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1.5 bg-border-light dark:bg-border-dark rounded-full" />
        
        {/* Selected region */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 bg-accent/30 rounded-full"
          style={{ left: `calc(${startPercent}% + 16px)`, right: `calc(${100 - endPercent}% + 16px)` }}
        />

        {/* Start handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `calc(${startPercent}% + 8px)` }}
          onMouseDown={handleMouseDown('start')}
          onTouchStart={handleTouchStart('start')}
        />

        {/* End handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `calc(${endPercent}% - 8px)` }}
          onMouseDown={handleMouseDown('end')}
          onTouchStart={handleTouchStart('end')}
        />

        {/* Time markers */}
        <div className="absolute -bottom-6 left-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          00:00
        </div>
        <div className="absolute -bottom-6 right-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
          {formatDuration(duration)}
        </div>
      </div>

      {/* Time inputs */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
            Start
          </label>
          <input
            type="text"
            value={formatDuration(startTime)}
            onChange={(e) => {
              const parts = e.target.value.split(':').map(Number);
              let seconds = 0;
              if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
              else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
              if (seconds >= 0 && seconds < endTime) {
                onTimeChange(seconds, endTime);
              }
            }}
            className="input-base text-center font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
            Duration
          </label>
          <div className="w-full px-4 py-3 bg-surface-secondary-light dark:bg-surface-secondary-dark border border-border-light dark:border-border-dark rounded-lg text-center font-mono text-text-primary-light dark:text-text-primary-dark">
            {formatDuration(selectedDuration)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
            End
          </label>
          <input
            type="text"
            value={formatDuration(endTime)}
            onChange={(e) => {
              const parts = e.target.value.split(':').map(Number);
              let seconds = 0;
              if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
              else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
              if (seconds > startTime && seconds <= duration) {
                onTimeChange(startTime, seconds);
              }
            }}
            className="input-base text-center font-mono"
          />
        </div>
      </div>
    </div>
  );
};
