import { useEffect, useRef, useState } from "react";

export interface PlayerStats {
  health: number;
  hunger: number;
  thirst: number;
  armor: number;
}

export function usePlayerStats() {
  const [stats, setStats] = useState<PlayerStats>({
    health: 100,
    hunger: 85,
    thirst: 80,
    armor: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Slowly decrease hunger and thirst over time
    intervalRef.current = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 0.05),
        thirst: Math.max(0, prev.thirst - 0.08),
        health:
          prev.hunger < 10 || prev.thirst < 10
            ? Math.max(0, prev.health - 0.1)
            : prev.health,
      }));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const eat = (amount = 30) => {
    setStats((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + amount),
    }));
  };

  const drink = (amount = 30) => {
    setStats((prev) => ({
      ...prev,
      thirst: Math.min(100, prev.thirst + amount),
    }));
  };

  const takeDamage = (amount: number) => {
    setStats((prev) => {
      const armorAbsorb = Math.min(prev.armor, amount * 0.5);
      return {
        ...prev,
        armor: Math.max(0, prev.armor - armorAbsorb),
        health: Math.max(0, prev.health - (amount - armorAbsorb)),
      };
    });
  };

  const heal = (amount = 20) => {
    setStats((prev) => ({
      ...prev,
      health: Math.min(100, prev.health + amount),
    }));
  };

  const addArmor = (amount = 25) => {
    setStats((prev) => ({
      ...prev,
      armor: Math.min(100, prev.armor + amount),
    }));
  };

  return { stats, eat, drink, takeDamage, heal, addArmor };
}
