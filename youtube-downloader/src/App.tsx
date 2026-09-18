import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sun, Moon, Monitor, Link as LinkIcon, Download, Play, Pause, 
  Volume2, Maximize, Video, Music, Check, AlertCircle, Loader2,
  Settings, ChevronRight, Trash2
} from 'lucide-react';
import classNames from 'classnames';

// Types
type Theme = 'light' | 'dark' | 'system';
type MediaType = 'video' | 'audio';
type VideoQuality = '360p' | '480p' | '720p' | '1080p';
type AudioFormat = 'mp3' | 'm4a';
type AudioQuality = '128' | '192' | '256' | '320';

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  channel: string;
  availableQualities: VideoQuality[];
  availableAudioFormats: AudioFormat[];
}

interface ProcessingState {
  status: 'idle' | 'analyzing' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

// Mock data for demonstration
const mockVideoInfo: VideoInfo = {
  id: 'dQw4w9WgXcQ',
  title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
  thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  duration: 212, // 3:32
  channel: 'Rick Astley',
  availableQualities: ['360p', '480p', '720p', '1080p'],
  availableAudioFormats: ['mp3', 'm4a'],
};

// Utility functions
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const parseTimeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};

const isValidYouTubeUrl = (url: string): boolean => {
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+$/,
  ];
  return patterns.some(pattern => pattern.test(url.trim()));
};

// Custom Hooks
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const applyTheme = (t: Theme) => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else if (t === 'light') {
        root.classList.remove('dark');
      } else {
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return { theme, setTheme };
};

// Components
const ThemeSelector: React.FC<{ theme: Theme; setTheme: (t: Theme) => void }> = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  const currentOption = options.find(o => o.value === theme);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                   hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium
                   text-gray-700 dark:text-gray-300"
      >
        {currentOption?.icon}
        <span className="hidden sm:inline">{currentOption?.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg 
                        border border-gray-200 dark:border-gray-700 py-1 z-50">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className={classNames(
                'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                theme === option.value
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Header: React.FC<{ theme: Theme; setTheme: (t: Theme) => void }> = ({ theme, setTheme }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-gray-950/80 
                       border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg 
                            flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              MediaClip
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
                                   dark:hover:text-white transition-colors">
              How it works
            </a>
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
                                   dark:hover:text-white transition-colors">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                               transition-colors text-gray-600 dark:text-gray-400">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const URLInput: React.FC<{ 
  url: string; 
  setUrl: (url: string) => void; 
  onAnalyze: () => void;
  isLoading: boolean;
}> = ({ url, setUrl, onAnalyze, isLoading }) => {
  const [error, setError] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch {
      setError('Unable to paste from clipboard');
    }
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    setError('');
    onAnalyze();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={classNames(
        'relative flex items-center bg-white dark:bg-gray-900 rounded-xl border-2 transition-all duration-200',
        error 
          ? 'border-red-300 dark:border-red-700 focus-within:border-red-500 dark:focus-within:border-red-600'
          : 'border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400'
      )}>
        <LinkIcon className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste YouTube URL"
          className="flex-1 px-4 py-4 bg-transparent border-none outline-none text-gray-900 
                     dark:text-white placeholder-gray-400 text-base"
          disabled={isLoading}
        />
        <div className="flex items-center gap-2 pr-3">
          {!url && (
            <button
              onClick={handlePaste}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 
                         dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Paste
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !url.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                       dark:disabled:bg-gray-700 text-white rounded-lg font-medium 
                       transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

const VideoPreview: React.FC<{ info: VideoInfo }> = ({ info }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 
                    dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        <div className="relative flex-shrink-0">
          <img
            src={info.thumbnail}
            alt={info.title}
            className="w-full sm:w-64 h-36 sm:h-40 object-cover rounded-xl"
          />
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white 
                          text-xs font-medium rounded">
            {formatTime(info.duration)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {info.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              {info.channel}
            </span>
            <span className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              YouTube
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaTypeSelector: React.FC<{
  type: MediaType;
  setType: (t: MediaType) => void;
}> = ({ type, setType }) => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      <button
        onClick={() => setType('video')}
        className={classNames(
          'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200',
          type === 'video'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        <Video className="w-5 h-5" />
        Video
      </button>
      <button
        onClick={() => setType('audio')}
        className={classNames(
          'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200',
          type === 'audio'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        <Music className="w-5 h-5" />
        Audio
      </button>
    </div>
  );
};

const QualitySelector: React.FC<{
  type: MediaType;
  videoQuality: VideoQuality;
  setVideoQuality: (q: VideoQuality) => void;
  audioFormat: AudioFormat;
  setAudioFormat: (f: AudioFormat) => void;
  audioQuality: AudioQuality;
  setAudioQuality: (q: AudioQuality) => void;
  availableQualities: VideoQuality[];
  availableFormats: AudioFormat[];
}> = ({
  type,
  videoQuality,
  setVideoQuality,
  audioFormat,
  setAudioFormat,
  audioQuality,
  setAudioQuality,
  availableQualities,
  availableFormats,
}) => {
  if (type === 'video') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quality
          </label>
          <div className="space-y-2">
            {availableQualities.map(q => (
              <label
                key={q}
                className={classNames(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                  videoQuality === q
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <input
                  type="radio"
                  name="videoQuality"
                  checked={videoQuality === q}
                  onChange={() => setVideoQuality(q)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="flex-1 font-medium text-gray-900 dark:text-white">{q}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {q === '360p' && '~50 MB'}
                  {q === '480p' && '~80 MB'}
                  {q === '720p' && '~150 MB'}
                  {q === '1080p' && '~300 MB'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Format
        </label>
        <div className="flex gap-3">
          {availableFormats.map(f => (
            <button
              key={f}
              onClick={() => setAudioFormat(f)}
              className={classNames(
                'flex-1 py-3 px-4 rounded-lg border font-medium uppercase transition-all',
                audioFormat === f
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quality
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['128', '192', '256', '320'] as AudioQuality[]).map(q => (
            <button
              key={q}
              onClick={() => setAudioQuality(q)}
              className={classNames(
                'py-3 px-4 rounded-lg border font-medium transition-all',
                audioQuality === q
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
              )}
            >
              {q} kbps
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TimelineEditor: React.FC<{
  duration: number;
  startTime: number;
  endTime: number;
  onStartChange: (t: number) => void;
  onEndChange: (t: number) => void;
}> = ({ duration, startTime, endTime, onStartChange, onEndChange }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);

  const handleMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;

    if (isDragging === 'start') {
      const newStart = Math.max(0, Math.min(newTime, endTime - 1));
      onStartChange(newStart);
    } else {
      const newEnd = Math.min(duration, Math.max(newTime, startTime + 1));
      onEndChange(newEnd);
    }
  }, [isDragging, duration, startTime, endTime, onStartChange, onEndChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const startPercent = (startTime / duration) * 100;
  const endPercent = (endTime / duration) * 100;

  const handleTimeInputChange = (value: string, isStart: boolean) => {
    const seconds = parseTimeToSeconds(value);
    if (seconds >= 0 && seconds <= duration) {
      if (isStart) {
        onStartChange(Math.min(seconds, endTime - 1));
      } else {
        onEndChange(Math.max(seconds, startTime + 1));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{formatTime(0)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div 
        ref={timelineRef}
        className="relative h-16 bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer"
      >
        {/* Selected region */}
        <div
          className="absolute h-full bg-blue-500/20 dark:bg-blue-500/30 rounded-xl"
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
        />

        {/* Start handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-blue-600 rounded-full 
                     shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center
                     hover:scale-110 transition-transform"
          style={{ left: `calc(${startPercent}% - 8px)` }}
          onMouseDown={handleMouseDown('start')}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>

        {/* End handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-blue-600 rounded-full 
                     shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center
                     hover:scale-110 transition-transform"
          style={{ left: `calc(${endPercent}% - 8px)` }}
          onMouseDown={handleMouseDown('end')}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>

        {/* Labels */}
        <div
          className="absolute -bottom-8 text-xs font-medium text-blue-600 dark:text-blue-400"
          style={{ left: `${startPercent}%`, transform: 'translateX(-50%)' }}
        >
          {formatTime(startTime)}
        </div>
        <div
          className="absolute -bottom-8 text-xs font-medium text-blue-600 dark:text-blue-400"
          style={{ left: `${endPercent}%`, transform: 'translateX(-50%)' }}
        >
          {formatTime(endTime)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start
          </label>
          <input
            type="text"
            value={formatTime(startTime)}
            onChange={(e) => handleTimeInputChange(e.target.value, true)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 
                       rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End
          </label>
          <input
            type="text"
            value={formatTime(endTime)}
            onChange={(e) => handleTimeInputChange(e.target.value, false)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 
                       rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration
          </label>
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 
                          dark:text-white font-medium">
            {formatTime(endTime - startTime)}
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewPlayer: React.FC<{
  thumbnail: string;
  startTime: number;
  endTime: number;
  duration: number;
}> = ({ thumbnail, startTime, endTime, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < endTime) {
      interval = setInterval(() => {
        setCurrentTime(t => {
          if (t >= endTime) {
            setIsPlaying(false);
            return startTime;
          }
          return t + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, endTime, startTime]);

  const progress = ((currentTime - startTime) / (endTime - startTime)) * 100;

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden relative aspect-video">
      <img
        src={thumbnail}
        alt="Preview"
        className="w-full h-full object-cover opacity-80"
      />
      
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center 
                     hover:scale-105 transition-transform shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-gray-900" />
          ) : (
            <Play className="w-8 h-8 text-gray-900 ml-1" />
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white font-mono">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-white font-mono">
            {formatTime(endTime - startTime)}
          </span>
        </div>
        
        <div className="flex items-center gap-4 mt-3">
          <button className="text-white/80 hover:text-white">
            <Volume2 className="w-5 h-5" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-white/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <button className="text-white/80 hover:text-white">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DownloadSection: React.FC<{
  type: MediaType;
  quality: string;
  startTime: number;
  endTime: number;
  processing: ProcessingState;
  onDownload: () => void;
}> = ({ type, quality, startTime, endTime, processing, onDownload }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Download</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Type</span>
          <p className="font-medium text-gray-900 dark:text-white capitalize">{type}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Format</span>
          <p className="font-medium text-gray-900 dark:text-white uppercase">
            {type === 'video' ? 'MP4' : 'MP3'}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Quality</span>
          <p className="font-medium text-gray-900 dark:text-white">{quality}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Duration</span>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatTime(endTime - startTime)}
          </p>
        </div>
      </div>

      {processing.status === 'processing' && (
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Processing...</span>
            <span className="font-medium text-gray-900 dark:text-white">{processing.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${processing.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{processing.message}</p>
        </div>
      )}

      {processing.status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 
                        dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Processing failed</span>
          </div>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{processing.error}</p>
        </div>
      )}

      {processing.status === 'complete' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 
                        dark:border-green-800">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3">
            <Check className="w-5 h-5" />
            <span className="font-medium">Your file is ready!</span>
          </div>
        </div>
      )}

      <button
        onClick={onDownload}
        disabled={processing.status === 'analyzing' || processing.status === 'processing'}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                   dark:disabled:bg-gray-700 text-white rounded-xl font-semibold 
                   transition-all duration-200 flex items-center justify-center gap-2 
                   disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
      >
        {processing.status === 'processing' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : processing.status === 'complete' ? (
          <>
            <Download className="w-5 h-5" />
            Download File
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download
          </>
        )}
      </button>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="text-center p-6">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center 
                      justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('720p');
  const [audioFormat, setAudioFormat] = useState<AudioFormat>('mp3');
  const [audioQuality, setAudioQuality] = useState<AudioQuality>('192');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  const handleAnalyze = async () => {
    setProcessing({ status: 'analyzing', progress: 0, message: 'Analyzing video...' });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setVideoInfo(mockVideoInfo);
    setStartTime(0);
    setEndTime(mockVideoInfo.duration);
    setProcessing({ status: 'idle', progress: 0, message: '' });
  };

  const handleDownload = async () => {
    setProcessing({ status: 'processing', progress: 0, message: 'Preparing your file...' });
    
    // Simulate processing
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProcessing(prev => ({
        ...prev,
        progress: i,
        message: i < 30 ? 'Downloading source...' : i < 60 ? 'Trimming media...' : 'Encoding output...',
      }));
    }
    
    setProcessing({ status: 'complete', progress: 100, message: '' });
    
    // Trigger download
    setTimeout(() => {
      alert('In a real app, this would download your file!');
    }, 500);
  };

  const handleReset = () => {
    setUrl('');
    setVideoInfo(null);
    setProcessing({ status: 'idle', progress: 0, message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header theme={theme} setTheme={setTheme} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!videoInfo ? (
          /* Empty State */
          <div className="text-center py-16 sm:py-24">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 
                           dark:text-white mb-6 tracking-tight">
              Download the part you need.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Paste a YouTube link, choose video or audio, select the exact section, and export it.
            </p>
            
            <URLInput
              url={url}
              setUrl={setUrl}
              onAnalyze={handleAnalyze}
              isLoading={processing.status === 'analyzing'}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
              <FeatureCard
                icon={<Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                title="Choose"
                description="Video or Audio"
              />
              <FeatureCard
                icon={<ChevronRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                title="Trim"
                description="Select exactly what you need"
              />
              <FeatureCard
                icon={<Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                title="Export"
                description="Download your finished file"
              />
            </div>
          </div>
        ) : (
          /* Video Info & Options */
          <div className="space-y-8">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 
                         hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </button>

            <VideoPreview info={videoInfo} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <MediaTypeSelector type={mediaType} setType={setMediaType} />
                
                <QualitySelector
                  type={mediaType}
                  videoQuality={videoQuality}
                  setVideoQuality={setVideoQuality}
                  audioFormat={audioFormat}
                  setAudioFormat={setAudioFormat}
                  audioQuality={audioQuality}
                  setAudioQuality={setAudioQuality}
                  availableQualities={videoInfo.availableQualities}
                  availableFormats={videoInfo.availableAudioFormats}
                />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Select Section
                  </h3>
                  <TimelineEditor
                    duration={videoInfo.duration}
                    startTime={startTime}
                    endTime={endTime}
                    onStartChange={setStartTime}
                    onEndChange={setEndTime}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Preview
                  </h3>
                  <PreviewPlayer
                    thumbnail={videoInfo.thumbnail}
                    startTime={startTime}
                    endTime={endTime}
                    duration={videoInfo.duration}
                  />
                </div>

                <DownloadSection
                  type={mediaType}
                  quality={mediaType === 'video' ? videoQuality : `${audioQuality} kbps`}
                  startTime={startTime}
                  endTime={endTime}
                  processing={processing}
                  onDownload={handleDownload}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Only download content you have permission to use. Respect copyright laws.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
