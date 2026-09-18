import React, { useState } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { VideoPreview } from './components/VideoPreview';
import { MediaSelector } from './components/MediaSelector';
import { QualitySelector } from './components/QualitySelector';
import { Timeline } from './components/Timeline';
import { PreviewPlayer } from './components/PreviewPlayer';
import { DownloadSection } from './components/DownloadSection';
import { useDownloader } from './hooks/useDownloader';
import type { MediaType } from './types';
import { extractVideoId } from './utils/helpers';

// Mock data for demo purposes
const getMockVideoInfo = (videoId: string) => ({
  id: videoId,
  title: 'Beautiful Nature - Relaxing Music with Scenic Views',
  thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  duration: 632, // 10:32
  channel: 'Nature Channel',
  formats: [
    { itag: 18, quality: '360p', mimeType: 'video/mp4', width: 640, height: 360, contentLength: '50000000' },
    { itag: 22, quality: '720p', mimeType: 'video/mp4', width: 1280, height: 720, contentLength: '150000000' },
    { itag: 137, quality: '1080p', mimeType: 'video/mp4', width: 1920, height: 1080, contentLength: '300000000' },
  ],
});

function App() {
  const { videoInfo, status, analyzeUrl, download, reset } = useDownloader();
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [quality, setQuality] = useState('720p');
  const [itag, setItag] = useState<number | undefined>(22);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const handleAnalyze = async (url: string) => {
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    // Use mock data for demo
    const mockInfo = getMockVideoInfo(videoId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set video info manually since we're using mock data
    // In production, this would come from the API
    Object.assign(videoInfo || {}, mockInfo);
    
    setStartTime(0);
    setEndTime(mockInfo.duration);
    
    return mockInfo;
  };

  const handleDownload = () => {
    if (!videoInfo) return;
    
    download({
      mediaType,
      format: quality.split('-')[0] || 'mp4',
      quality,
      startTime,
      endTime,
      itag,
    });
  };

  const handleTimeChange = (start: number, end: number) => {
    setStartTime(start);
    setEndTime(end);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d] transition-colors duration-300">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        {!videoInfo && (
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 tracking-tight">
              Download the part you need.
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto mb-8">
              Paste a YouTube link, choose video or audio, select the exact section, and export it.
            </p>
          </div>
        )}

        {/* URL Input */}
        <div className={`mb-8 ${!videoInfo ? 'mt-12' : ''}`}>
          <UrlInput onAnalyze={handleAnalyze} isLoading={status.status === 'analyzing'} />
        </div>

        {/* Empty State Features */}
        {!videoInfo && status.status !== 'analyzing' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface-secondary-light dark:bg-surface-secondary-dark flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Choose</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Video or Audio</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface-secondary-light dark:bg-surface-secondary-dark flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Trim</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Select exactly what you need</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface-secondary-light dark:bg-surface-secondary-dark flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Export</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Download your finished file</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {status.status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <svg className="animate-spin w-10 h-10 text-accent mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">Analyzing video...</p>
          </div>
        )}

        {/* Main Content */}
        {videoInfo && (
          <div className="space-y-8 animate-slide-up">
            {/* Video Info */}
            <VideoPreview videoInfo={videoInfo} />

            {/* Media Type Selector */}
            <div className="flex justify-center">
              <MediaSelector mediaType={mediaType} onChange={setMediaType} />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Options */}
              <div className="space-y-6">
                {/* Quality Selector */}
                <div className="card">
                  <QualitySelector
                    mediaType={mediaType}
                    formats={videoInfo.formats}
                    selectedQuality={quality}
                    selectedItag={itag}
                    onQualityChange={(q, i) => {
                      setQuality(q);
                      setItag(i);
                    }}
                  />
                </div>

                {/* Download Section */}
                <DownloadSection
                  mediaType={mediaType}
                  format={quality}
                  quality={quality}
                  startTime={startTime}
                  endTime={endTime}
                  duration={endTime - startTime}
                  status={status}
                  onDownload={handleDownload}
                />
              </div>

              {/* Right Column - Timeline & Preview */}
              <div className="space-y-6">
                {/* Preview Player */}
                <PreviewPlayer
                  videoId={videoInfo.id}
                  duration={videoInfo.duration}
                  startTime={startTime}
                  endTime={endTime}
                />

                {/* Timeline */}
                <div className="card">
                  <Timeline
                    duration={videoInfo.duration}
                    startTime={startTime}
                    endTime={endTime}
                    onTimeChange={handleTimeChange}
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={reset}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light dark:border-border-dark mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Only download content you have permission to use. Respect copyright and terms of service.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
