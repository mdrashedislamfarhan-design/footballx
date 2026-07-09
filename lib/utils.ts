import { Match } from '@/types';

export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const classes: string[] = [];
  inputs.forEach(input => {
    if (!input) return;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, val]) => {
        if (val) classes.push(key);
      });
    }
  });
  return classes.join(' ');
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  // Use fixed UTC-offset display to avoid SSR/client mismatch
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatCountdown(isoString: string): string {
  const diff = new Date(isoString).getTime() - Date.now();
  if (diff <= 0) return '00:00';
  const hours = Math.floor(diff / 3_600_000);
  const mins  = Math.floor((diff % 3_600_000) / 60_000);
  if (hours > 0) return `${hours}h ${mins}m`;
  const secs  = Math.floor((diff % 60_000) / 1_000);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getMatchStatusLabel(match: Match): string {
  if (match.status === 'live') return `${match.minute}'`;
  if (match.status === 'upcoming') return formatTime(match.startTime);
  if (match.status === 'finished') return 'FT';
  return 'PST';
}

export function isMatchLive(match: Match): boolean {
  return match.status === 'live';
}

export function getScoreString(match: Match): string {
  if (match.homeScore === null) return 'vs';
  return `${match.homeScore} - ${match.awayScore}`;
}
