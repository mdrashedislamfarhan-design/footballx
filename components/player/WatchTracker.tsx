'use client';

import { useEffect } from 'react';
import { saveWatchProgress } from '@/lib/watchHistory';

interface WatchTrackerProps {
  id: string;
  title: string;
  coverImage: string;
  url: string;
  episode?: number;
  season?: number;
  mediaType: 'anime' | 'movie' | 'series';
}

export default function WatchTracker({
  id,
  title,
  coverImage,
  url,
  episode,
  season,
  mediaType,
}: WatchTrackerProps) {
  useEffect(() => {
    if (id && title) {
      saveWatchProgress({
        id,
        title,
        coverImage,
        url,
        episode,
        season,
        mediaType,
      });
    }
  }, [id, title, coverImage, url, episode, season, mediaType]);

  return null;
}
