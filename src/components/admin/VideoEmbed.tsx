
import React from 'react';

interface VideoEmbedProps {
  url: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, className = '' }) => {
  // Function to extract video ID and platform
  const getVideoInfo = (url: string) => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    // Vimeo URL patterns
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (youtubeMatch && youtubeMatch[1]) {
      return {
        platform: 'youtube',
        id: youtubeMatch[1]
      };
    } else if (vimeoMatch && vimeoMatch[1]) {
      return {
        platform: 'vimeo',
        id: vimeoMatch[1]
      };
    }
    
    // If URL doesn't match any known pattern
    return null;
  };

  const videoInfo = getVideoInfo(url);
  
  if (!videoInfo) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center rounded-md p-4 ${className}`}>
        <p className="text-gray-500 text-sm">Invalid video URL</p>
      </div>
    );
  }
  
  // Create embed URL based on platform
  let embedUrl = '';
  if (videoInfo.platform === 'youtube') {
    embedUrl = `https://www.youtube.com/embed/${videoInfo.id}`;
  } else if (videoInfo.platform === 'vimeo') {
    embedUrl = `https://player.vimeo.com/video/${videoInfo.id}`;
  }
  
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
        <iframe 
          className="absolute top-0 left-0 w-full h-full rounded-md"
          src={embedUrl}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};
