'use client';

import { useEffect, useState } from 'react';
import { CinematicMedia, mediaExists, type MediaSources } from './CinematicMedia';

/** Optional ambient plate for dashboard — drop files in /media/dashboard/ */
export default function DashboardAmbient() {
  const [sources, setSources] = useState<MediaSources>({});

  useEffect(() => {
    (async () => {
      const video = '/media/dashboard/ambient.mp4';
      const poster = '/media/dashboard/texture.jpg';
      const [hasV, hasP] = await Promise.all([mediaExists(video), mediaExists(poster)]);
      setSources({
        video: hasV ? video : undefined,
        poster: hasP ? poster : undefined,
      });
    })();
  }, []);

  if (!sources.video && !sources.poster) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
      <CinematicMedia sources={sources} parallax={false} intensity={0.4} />
      <div className="absolute inset-0 bg-[#0C0C0B]/75" />
    </div>
  );
}
