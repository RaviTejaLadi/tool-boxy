import { useSyncExternalStore } from 'react';

import { tools } from '@/config/tools';

const STORAGE_KEY = 'tool-boxy-favorites-v1';

const knownUrls = new Set(tools.map((tool) => tool.url));

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((url): url is string => typeof url === 'string' && knownUrls.has(url));
  } catch {
    return [];
  }
}

let favorites = readFavorites();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function getFavorites() {
  return favorites;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setFavorites(next: string[]) {
  favorites = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  emit();
}

export function useToolFavorites() {
  const current = useSyncExternalStore(subscribe, getFavorites, getFavorites);

  const isFavorite = (url: string) => current.includes(url);

  const toggleFavorite = (url: string) => {
    if (!knownUrls.has(url)) return;
    setFavorites(favorites.includes(url) ? favorites.filter((item) => item !== url) : [...favorites, url]);
  };

  return { favorites: current, isFavorite, toggleFavorite };
}
