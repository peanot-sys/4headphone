import { useState, useCallback } from 'react';
import type { VideoInfo, ProcessingStatus, DownloadOptions } from '../types';

const API_BASE = '/api';

export function useDownloader() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>({ status: 'idle' });

  const analyzeUrl = useCallback(async (url: string) => {
    setStatus({ status: 'analyzing', message: 'Analyzing video...' });
    
    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze video');
      }

      const data = await response.json();
      setVideoInfo(data);
      setStatus({ status: 'idle' });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to analyze video';
      setStatus({ status: 'error', error: message });
      throw error;
    }
  }, []);

  const download = useCallback(async (options: DownloadOptions) => {
    setStatus({ status: 'processing', progress: 0, message: 'Preparing your file...' });

    try {
      const response = await fetch(`${API_BASE}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Download failed');
      }

      // Create blob from response
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      setStatus({ 
        status: 'completed', 
        message: 'Your file is ready',
        downloadUrl 
      });

      // Auto-trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `download.${options.mediaType === 'audio' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up after delay
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 60000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Download failed';
      setStatus({ status: 'error', error: message });
    }
  }, []);

  const reset = useCallback(() => {
    setVideoInfo(null);
    setStatus({ status: 'idle' });
  }, []);

  return {
    videoInfo,
    status,
    analyzeUrl,
    download,
    reset,
  };
}
