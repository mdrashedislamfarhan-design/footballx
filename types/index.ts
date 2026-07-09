export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;        // emoji fallback
  logoUrl?: string;    // real image URL (ESPN CDN / flagcdn)
  color?: string;
  country?: string;
  competition?: string;
  followers?: string;
  isNational?: boolean;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  logoUrl?: string;
  country: string;
  countryFlag: string;
  matchesLive: number;
  matchesToday: number;
  color?: string;
  season?: string;
  clubsCount?: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: 'live' | 'upcoming' | 'finished' | 'postponed' | 'cancelled';
  minute?: number;
  startTime: string;
  league: League;
  venue?: string;
  stats?: MatchStats;
  events?: MatchEvent[];
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var';
  minute: number;
  team: 'home' | 'away';
  playerName: string;
  assistName?: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  nationality: string;
  avatar?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface StatsItem {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}
