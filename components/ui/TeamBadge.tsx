'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Team } from '@/types';

interface TeamBadgeProps {
  team: Team;
  size?: number;       // px, default 48
  className?: string;
}

export function TeamBadge({ team, size = 48, className = '' }: TeamBadgeProps) {
  const [imgError, setImgError] = useState(false);

  const containerStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
  };

  // If no logoUrl or image failed → show emoji fallback
  if (!team.logoUrl || imgError) {
    const fontSize = size * 0.55;
    return (
      <div
        className={`flex items-center justify-center rounded-[20%] bg-white/[0.04] border border-white/[0.08] select-none ${className}`}
        style={{ ...containerStyle, fontSize }}
      >
        {team.logo}
      </div>
    );
  }

  // National teams → show flag image (rectangular, wider aspect)
  if (team.isNational) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.04] flex items-center justify-center ${className}`}
        style={containerStyle}
      >
        <Image
          src={team.logoUrl}
          alt={team.name}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          unoptimized
          sizes={`${size}px`}
        />
      </div>
    );
  }

  // Club teams → show badge/crest image
  return (
    <div
      className={`relative overflow-hidden rounded-[20%] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center ${className}`}
      style={containerStyle}
    >
      <Image
        src={team.logoUrl}
        alt={team.name}
        fill
        className="object-contain p-1"
        onError={() => setImgError(true)}
        unoptimized
        sizes={`${size}px`}
      />
    </div>
  );
}
