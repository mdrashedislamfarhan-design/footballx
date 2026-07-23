export interface ContinueWatchingItem {
  id: string; // unique ID e.g. 'anime-20' or 'movie-550'
  title: string;
  coverImage: string;
  url: string; // link e.g. '/anime/20?ep=5'
  episode?: number;
  season?: number;
  mediaType: 'anime' | 'movie' | 'series';
  updatedAt: number;
}

const STORAGE_KEY = 'anistream_continue_watching';

export function getContinueWatchingList(): ContinueWatchingItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: ContinueWatchingItem[] = JSON.parse(raw);
    return Array.isArray(list) ? list.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

export function saveWatchProgress(item: Omit<ContinueWatchingItem, 'updatedAt'>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getContinueWatchingList();
    const filtered = existing.filter((i) => i.id !== item.id);
    const updated: ContinueWatchingItem = {
      ...item,
      updatedAt: Date.now(),
    };

    // Keep top 12 recent items
    const newList = [updated, ...filtered].slice(0, 12);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new Event('anistream_history_updated'));
  } catch (err) {
    console.error('Failed to save watch progress:', err);
  }
}

export function removeWatchItem(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getContinueWatchingList();
    const newList = existing.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new Event('anistream_history_updated'));
  } catch (err) {
    console.error('Failed to remove watch item:', err);
  }
}
