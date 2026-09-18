export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  channel?: string;
  formats: VideoFormat[];
}

export interface VideoFormat {
  itag: number;
  quality: string;
  mimeType: string;
  bitrate?: number;
  width?: number;
  height?: number;
  fps?: number;
  audioQuality?: string;
  audioSampleRate?: string;
  contentLength?: string;
}

export interface AudioFormat {
  itag: number;
  quality: string;
  mimeType: string;
  audioBitrate?: number;
  audioQuality?: string;
  audioSampleRate?: string;
  contentLength?: string;
}

export type MediaType = 'video' | 'audio';

export interface DownloadOptions {
  mediaType: MediaType;
  format: string;
  quality: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  itag?: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ProcessingStatus {
  status: 'idle' | 'analyzing' | 'processing' | 'completed' | 'error';
  progress?: number;
  message?: string;
  error?: string;
  downloadUrl?: string;
}
