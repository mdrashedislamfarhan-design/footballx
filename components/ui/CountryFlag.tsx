'use client';

import React from 'react';

interface CountryFlagProps {
  code: string; // 'IN' | 'US' | 'GB' | 'JP' | 'FR' | 'ES' | 'DE' | 'IT' | 'SA' | 'BR' | 'RU' | 'TR' | 'TH' | 'PL' | 'PT' | 'GLOBE';
  className?: string;
  size?: number;
}

export default function CountryFlag({ code, className = '', size = 24 }: CountryFlagProps) {
  const c = code.toUpperCase();

  switch (c) {
    case 'IN': // India
    case 'HI':
    case 'TA':
    case 'TE':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#f93" d="0 0h640v160H0z"/>
          <path fill="#fff" d="0 160h640v160H0z"/>
          <path fill="#128807" d="0 320h640v160H0z"/>
          <g transform="translate(320 240)">
            <circle r="70" fill="none" stroke="#000080" strokeWidth="8"/>
            <circle r="15" fill="#000080"/>
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={i} x1="0" y1="0" x2="0" y2="-70" stroke="#000080" strokeWidth="4" transform={`rotate(${i * 15})`}/>
            ))}
          </g>
        </svg>
      );

    case 'US': // United States
    case 'EN':
    case 'DUB':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#bd3d44" d="0 0h640v480H0z"/>
          <path stroke="#fff" strokeWidth="37" d="0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
          <path fill="#192f5d" d="0 0h256v258.5H0z"/>
          <g fill="#fff" transform="scale(1.2)">
            <circle cx="20" cy="20" r="6"/><circle cx="60" cy="20" r="6"/><circle cx="100" cy="20" r="6"/>
            <circle cx="40" cy="50" r="6"/><circle cx="80" cy="50" r="6"/><circle cx="120" cy="50" r="6"/>
            <circle cx="20" cy="80" r="6"/><circle cx="60" cy="80" r="6"/><circle cx="100" cy="80" r="6"/>
            <circle cx="40" cy="110" r="6"/><circle cx="80" cy="110" r="6"/><circle cx="120" cy="110" r="6"/>
            <circle cx="20" cy="140" r="6"/><circle cx="60" cy="140" r="6"/><circle cx="100" cy="140" r="6"/>
            <circle cx="40" cy="170" r="6"/><circle cx="80" cy="170" r="6"/><circle cx="120" cy="170" r="6"/>
          </g>
        </svg>
      );

    case 'GB': // United Kingdom
    case 'UK':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#012169" d="0 0h640v480H0z"/>
          <path stroke="#fff" strokeWidth="60" d="m0 0 640 480M640 0 0 480"/>
          <path stroke="#c8102e" strokeWidth="40" d="m0 0 640 480M640 0 0 480"/>
          <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
          <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/>
        </svg>
      );

    case 'JP': // Japan
    case 'SUB':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#fff" d="0 0h640v480H0z"/>
          <circle cx="320" cy="240" r="140" fill="#bc002d"/>
        </svg>
      );

    case 'FR': // France
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#002395" d="0 0h213.3v480H0z"/>
          <path fill="#fff" d="213.3 0h213.4v480H213.3z"/>
          <path fill="#ed2939" d="426.7 0H640v480H426.7z"/>
        </svg>
      );

    case 'ES': // Spain
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#aa151b" d="0 0h640v120H0z;0 360h640v120H0z"/>
          <path fill="#f1bf00" d="0 120h640v240H0z"/>
          <path fill="#aa151b" d="0 0h640v120H0z"/>
        </svg>
      );

    case 'DE': // Germany
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#000" d="0 0h640v160H0z"/>
          <path fill="#dd0000" d="0 160h640v160H0z"/>
          <path fill="#ffce00" d="0 320h640v160H0z"/>
        </svg>
      );

    case 'IT': // Italy
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#009246" d="0 0h213.3v480H0z"/>
          <path fill="#fff" d="213.3 0h213.4v480H213.3z"/>
          <path fill="#ce2b37" d="426.7 0H640v480H426.7z"/>
        </svg>
      );

    case 'BR': // Brazil
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#009c3b" d="0 0h640v480H0z"/>
          <path fill="#ffdf00" d="M320 40 580 240 320 440 60 240z"/>
          <circle cx="320" cy="240" r="110" fill="#002776"/>
        </svg>
      );

    case 'RU': // Russia
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#fff" d="0 0h640v160H0z"/>
          <path fill="#0039a6" d="0 160h640v160H0z"/>
          <path fill="#d52b1e" d="0 320h640v160H0z"/>
        </svg>
      );

    case 'SA': // Saudi Arabia / Arab
    case 'ARAB':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#006c35" d="0 0h640v480H0z"/>
          <path fill="#fff" d="M120 220h400v40H120z"/>
        </svg>
      );

    case 'TR': // Turkey
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#e30a17" d="0 0h640v480H0z"/>
          <circle cx="280" cy="240" r="120" fill="#fff"/>
          <circle cx="310" cy="240" r="96" fill="#e30a17"/>
        </svg>
      );

    case 'TH': // Thailand
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <path fill="#a51931" d="0 0h640v480H0z"/>
          <path fill="#f4f5f8" d="0 80h640v320H0z"/>
          <path fill="#2d2a4a" d="0 160h640v160H0z"/>
        </svg>
      );

    default: // Global / fallback
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 640 480" className={`inline-block rounded-sm shadow-sm ${className}`}>
          <rect width="640" height="480" fill="#3B82F6" rx="10"/>
          <circle cx="320" cy="240" r="140" fill="none" stroke="#fff" strokeWidth="24"/>
          <path d="M180 240h280M320 100v280" stroke="#fff" strokeWidth="20"/>
        </svg>
      );
  }
}
