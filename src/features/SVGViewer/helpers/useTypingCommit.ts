import { useEffect, useRef } from 'react';
import { useViewerStore } from '../stores';

export function useTypingCommit() {
  const endTyping = useViewerStore((s) => s.endTyping);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => endTyping(), 400);
  };
}
