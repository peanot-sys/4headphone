import React from 'react';
import type { VideoFormat, AudioFormat } from '../types';
import { formatBytes } from '../utils/helpers';

interface QualitySelectorProps {
  mediaType: 'video' | 'audio';
  formats: (VideoFormat | AudioFormat)[];
  selectedQuality: string;
  selectedItag?: number;
  onQualityChange: (quality: string, itag?: number) => void;
}

export const QualitySelector: React.FC<QualitySelectorProps> = ({
  mediaType,
  formats,
  selectedQuality,
  selectedItag,
  onQualityChange,
}) => {
  if (mediaType === 'video') {
    const videoFormats = formats as VideoFormat[];
    const qualities = [
      { label: '360p', value: '360p' },
      { label: '480p', value: '480p' },
      { label: '720p', value: '720p' },
      { label: '1080p', value: '1080p' },
    ].filter(q => 
      videoFormats.some(f => f.quality.includes(q.value.replace('p', '')))
    );

    if (qualities.length === 0) {
      qualities.push({ label: 'Default', value: 'default' });
    }

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          Quality
        </label>
        <div className="space-y-2">
          {qualities.map(({ label, value }) => {
            const format = videoFormats.find(f => f.quality.includes(value.replace('p', '')));
            const size = format?.contentLength ? formatBytes(parseInt(format.contentLength)) : '';
            
            return (
              <label
                key={value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedQuality === value
                    ? 'border-accent bg-accent/5'
                    : 'border-border-light dark:border-border-dark hover:border-accent/50'
                }`}
              >
                <input
                  type="radio"
                  name="quality"
                  value={value}
                  checked={selectedQuality === value}
                  onChange={() => onQualityChange(value, format?.itag)}
                  className="w-4 h-4 text-accent focus:ring-accent"
                />
                <span className="flex-1 text-sm text-text-primary-light dark:text-text-primary-dark">
                  {label}
                </span>
                {size && (
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {size}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // Audio mode
  const audioFormats = formats as AudioFormat[];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-3">
          Format
        </label>
        <div className="flex gap-2">
          {['mp3', 'm4a'].map((format) => (
            <button
              key={format}
              onClick={() => onQualityChange(format.toUpperCase())}
              className={`px-4 py-2 rounded-lg text-sm font-medium uppercase transition-all ${
                selectedQuality === format.toUpperCase()
                  ? 'bg-accent text-white'
                  : 'bg-surface-secondary-light dark:bg-surface-secondary-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
              }`}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-3">
          Bitrate
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[128, 192, 256, 320].map((bitrate) => (
            <button
              key={bitrate}
              onClick={() => onQualityChange(`${selectedQuality}-${bitrate}`)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedQuality.includes(bitrate.toString())
                  ? 'bg-accent text-white'
                  : 'bg-surface-secondary-light dark:bg-surface-secondary-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
              }`}
            >
              {bitrate} kbps
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
