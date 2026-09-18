import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mock video data for demo purposes
const mockVideoData: Record<string, any> = {};

// Analyze endpoint - returns mock data for demo
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  // Extract video ID from YouTube URL
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  
  if (!videoIdMatch || !videoIdMatch[1]) {
    return res.status(400).json({ message: 'Invalid YouTube URL' });
  }

  const videoId = videoIdMatch[1];

  // In production, this would call a real API to fetch video info
  // For demo, we return mock data
  const mockResponse = {
    id: videoId,
    title: 'Beautiful Nature - Relaxing Music with Scenic Views',
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: 632, // 10:32 in seconds
    channel: 'Nature Channel',
    formats: [
      { itag: 18, quality: '360p', mimeType: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"', width: 640, height: 360, fps: 30, contentLength: '52428800' },
      { itag: 22, quality: '720p', mimeType: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"', width: 1280, height: 720, fps: 30, contentLength: '157286400' },
      { itag: 137, quality: '1080p', mimeType: 'video/mp4; codecs="avc1.640028"', width: 1920, height: 1080, fps: 30, contentLength: '314572800' },
    ],
  };

  mockVideoData[videoId] = mockResponse;
  
  // Simulate API delay
  setTimeout(() => {
    res.json(mockResponse);
  }, 800);
});

// Download endpoint - returns mock file for demo
app.post('/api/download', async (req: Request, res: Response) => {
  const { mediaType, format, quality, startTime, endTime, itag } = req.body;

  if (!mediaType || !format || !quality) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate time range
  if (startTime < 0 || endTime <= startTime) {
    return res.status(400).json({ message: 'Invalid time range' });
  }

  // Simulate processing delay
  const progressInterval = setInterval(() => {
    // In production, you would emit progress via WebSocket or Server-Sent Events
  }, 500);

  setTimeout(() => {
    clearInterval(progressInterval);

    // In production, this would:
    // 1. Download the source video using ytdl-core or similar
    // 2. Use FFmpeg to trim and convert
    // 3. Stream the result back to the client
    
    // For demo, create a small mock MP4 file
    const mockMp4Header = Buffer.from([
      0x00, 0x00, 0x00, 0x1C, // box size
      0x66, 0x74, 0x79, 0x70, // 'ftyp'
      0x69, 0x73, 0x6F, 0x6D, // 'isom'
      0x69, 0x73, 0x6F, 0x6D, // 'isom'
      0x61, 0x76, 0x63, 0x31, // 'avc1'
      0x6D, 0x70, 0x34, 0x32, // 'mp42'
    ]);

    res.setHeader('Content-Type', mediaType === 'audio' ? 'audio/mpeg' : 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="download.${mediaType === 'audio' ? 'mp3' : 'mp4'}"`);
    
    // Send mock file (small header only for demo)
    res.send(mockMp4Header);
  }, 2000);
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
