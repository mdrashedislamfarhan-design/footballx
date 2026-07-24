'use client';

import React from 'react';

interface CountryFlagProps {
  code: string;
  className?: string;
  size?: number;
}

export default function CountryFlag({ code, className = '', size = 24 }: CountryFlagProps) {
  const c = (code || 'US').toUpperCase();
  const width = size;
  const height = Math.round(size * 0.72);

  switch (c) {
    case 'IN':
    case 'HI':
    case 'TA':
    case 'TE':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="13.3" y="0" fill="#FF9933" />
          <rect width="60" height="13.3" y="13.3" fill="#FFFFFF" />
          <rect width="60" height="13.4" y="26.6" fill="#138808" />
          <circle cx="30" cy="20" r="5" fill="none" stroke="#000080" strokeWidth="1.2" />
          <circle cx="30" cy="20" r="1" fill="#000080" />
        </svg>
      );

    case 'US':
    case 'EN':
    case 'DUB':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="40" fill="#B22234" />
          <rect width="60" height="3" y="3" fill="#FFFFFF" />
          <rect width="60" height="3" y="9" fill="#FFFFFF" />
          <rect width="60" height="3" y="15" fill="#FFFFFF" />
          <rect width="60" height="3" y="21" fill="#FFFFFF" />
          <rect width="60" height="3" y="27" fill="#FFFFFF" />
          <rect width="60" height="3" y="33" fill="#FFFFFF" />
          <rect width="26" height="21" fill="#3C3B6E" />
          <circle cx="6" cy="5" r="1" fill="#FFFFFF" />
          <circle cx="13" cy="5" r="1" fill="#FFFFFF" />
          <circle cx="20" cy="5" r="1" fill="#FFFFFF" />
          <circle cx="9.5" cy="10.5" r="1" fill="#FFFFFF" />
          <circle cx="16.5" cy="10.5" r="1" fill="#FFFFFF" />
          <circle cx="6" cy="16" r="1" fill="#FFFFFF" />
          <circle cx="13" cy="16" r="1" fill="#FFFFFF" />
          <circle cx="20" cy="16" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'GB':
    case 'UK':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0 L60 40 M60 0 L0 40" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
          <path d="M30 0 V40 M0 20 H60" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );

    case 'JP':
    case 'SUB':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="40" fill="#FFFFFF" />
          <circle cx="30" cy="20" r="12" fill="#BC002D" />
        </svg>
      );

    case 'FR':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="20" height="40" x="0" fill="#002395" />
          <rect width="20" height="40" x="20" fill="#FFFFFF" />
          <rect width="20" height="40" x="40" fill="#ED2939" />
        </svg>
      );

    case 'ES':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="10" y="0" fill="#AA151B" />
          <rect width="60" height="20" y="10" fill="#F1BF00" />
          <rect width="60" height="10" y="30" fill="#AA151B" />
        </svg>
      );

    case 'DE':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="13.3" y="0" fill="#000000" />
          <rect width="60" height="13.3" y="13.3" fill="#DD0000" />
          <rect width="60" height="13.4" y="26.6" fill="#FFCE00" />
        </svg>
      );

    case 'IT':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="20" height="40" x="0" fill="#009246" />
          <rect width="20" height="40" x="20" fill="#FFFFFF" />
          <rect width="20" height="40" x="40" fill="#CE2B37" />
        </svg>
      );

    case 'BR':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="40" fill="#009C3B" />
          <polygon points="30,4 54,20 30,36 6,20" fill="#FFDF00" />
          <circle cx="30" cy="20" r="9" fill="#002776" />
        </svg>
      );

    case 'RU':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="13.3" y="0" fill="#FFFFFF" />
          <rect width="60" height="13.3" y="13.3" fill="#0039A6" />
          <rect width="60" height="13.4" y="26.6" fill="#D52B1E" />
        </svg>
      );

    case 'SA':
    case 'AR':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="40" fill="#006C35" />
          <rect width="36" height="4" x="12" y="24" fill="#FFFFFF" />
        </svg>
      );

    case 'TR':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="40" fill="#E30A17" />
          <circle cx="26" cy="20" r="10" fill="#FFFFFF" />
          <circle cx="29" cy="20" r="8" fill="#E30A17" />
          <polygon points="36,20 41,18 39,23 43,20 38,22" fill="#FFFFFF" />
        </svg>
      );

    case 'TH':
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="6.6" y="0" fill="#A51931" />
          <rect width="60" height="6.6" y="6.6" fill="#F4F5F8" />
          <rect width="60" height="13.6" y="13.2" fill="#2D2A4A" />
          <rect width="60" height="6.6" y="26.8" fill="#F4F5F8" />
          <rect width="60" height="6.6" y="33.4" fill="#A51931" />
        </svg>
      );

    default:
      return (
        <svg width={width} height={height} viewBox="0 0 60 40" className={`inline-block rounded-sm shadow-sm flex-shrink-0 ${className}`}>
          <rect width="60" height="40" fill="#3B82F6" rx="4" />
          <circle cx="30" cy="20" r="10" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M15 20 H45 M30 10 V30" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      );
  }
}
