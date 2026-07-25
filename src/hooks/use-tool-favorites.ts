import { useEffect, useState } from 'react';

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

export function useToolFavorites() {
  const [favorites, setFavorites] = useState<string[]>(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (url: string) => favorites.includes(url);

  const toggleFavorite = (url: string) => {
    if (!knownUrls.has(url)) return;
    setFavorites((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
  };

  return { favorites, isFavorite, toggleFavorite };
}
