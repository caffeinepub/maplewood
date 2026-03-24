import { useEffect, useRef, useState } from "react";

export function useWantedLevel() {
  const [wantedLevel, setWantedLevel] = useState(0);
  const decayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Wanted level decays over time when not committing crimes
    decayRef.current = setInterval(() => {
      setWantedLevel((prev) => {
        if (prev > 0) return Math.max(0, prev - 0.01);
        return prev;
      });
    }, 1000);

    return () => {
      if (decayRef.current) clearInterval(decayRef.current);
    };
  }, []);

  const addWanted = (amount = 1) => {
    setWantedLevel((prev) => Math.min(5, prev + amount));
  };

  const clearWanted = () => setWantedLevel(0);

  return { wantedLevel: Math.floor(wantedLevel), addWanted, clearWanted };
}
