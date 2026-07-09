'use client';

import { useEffect, useState } from 'react';
import { formatCountdown } from '@/lib/utils';

interface CountdownTimerProps {
  targetTime: string;
  className?: string;
}

export function CountdownTimer({ targetTime, className = '' }: CountdownTimerProps) {
  const [display, setDisplay] = useState('00:00');

  useEffect(() => {
    // Initial format
    setDisplay(formatCountdown(targetTime));
    const id = setInterval(() => {
      setDisplay(formatCountdown(targetTime));
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  return (
    <span className={`font-mono font-bold tabular-nums ${className}`}>
      {display}
    </span>
  );
}
