# MediaClip - Modern YouTube Media Downloader

A premium, modern web application for downloading and trimming YouTube videos and audio.

## Features

- **Clean, Minimal Interface**: Premium design with smooth animations and strong visual hierarchy
- **Light/Dark Mode**: Theme switcher with Light, Dark, and System options (persists after refresh)
- **Video/Audio Selection**: Choose between video (MP4) or audio (MP3/M4A) formats
- **Quality Options**: Select from multiple quality levels (360p to 1080p for video, 128-320 kbps for audio)
- **Timeline Editor**: Visual timeline with drag handles to select exact start/end points
- **Preview Player**: Preview your selected section before downloading
- **Responsive Design**: Works perfectly on desktop and mobile
- **Processing States**: Clear loading, progress, and completion states

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Utilities**: Classnames

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd youtube-downloader
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or next available port).

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Paste a YouTube URL** in the input field
2. Click **Analyze** to fetch video information
3. Choose **Video** or **Audio** format
4. Select your preferred **quality**
5. Use the **timeline editor** to select the exact section you want
6. **Preview** your selection
7. Click **Download** to process and download your file

## Project Structure

```
youtube-downloader/
├── src/
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles with Tailwind
│   └── main.tsx         # Entry point
├── public/
│   └── favicon.svg      # App icon
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Design Principles

- **Minimal**: No clutter, only essential elements
- **Premium**: Spacious layout, subtle borders and shadows
- **Fast**: Smooth animations, quick transitions
- **Accessible**: Clear typography, good contrast ratios
- **Responsive**: Mobile-first approach

## Color System

### Light Theme
- Background: Neutral white/gray
- Surface: Pure white
- Text: Dark neutral gray
- Accent: Restrained blue (#3b82f6)

### Dark Theme
- Background: Deep charcoal (#030712)
- Surface: Dark gray (#111827)
- Text: White/off-white
- Accent: Same blue as light mode

## License

MIT

## Note

This is a frontend demo with mock data. To make it fully functional, you would need to:

1. Set up a backend server (Node.js/Express)
2. Integrate with a YouTube data API service
3. Implement FFmpeg for media processing
4. Handle file storage and delivery

Always respect copyright laws and only download content you have permission to use.
