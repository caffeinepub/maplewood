interface MiniMapProps {
  playerPos: { x: number; z: number };
}

const LANDMARKS = [
  { name: 'City Hall', x: 50, z: 50, color: '#ff6600', icon: '🏛' },
  { name: 'Airport', x: 80, z: 20, color: '#00aaff', icon: '✈' },
  { name: 'Ski Resort', x: 15, z: 15, color: '#ffffff', icon: '⛷' },
  { name: 'Dealership', x: 65, z: 60, color: '#ffcc00', icon: '🚗' },
  { name: 'Police HQ', x: 45, z: 55, color: '#4488ff', icon: '🚔' },
  { name: 'Hotel', x: 55, z: 45, color: '#ff44aa', icon: '🏨' },
];

export default function MiniMap({ playerPos }: MiniMapProps) {
  // Normalize player position to 0-100 range (world is -500 to 500)
  const px = ((playerPos.x + 500) / 1000) * 100;
  const pz = ((playerPos.z + 500) / 1000) * 100;

  return (
    <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-neon-orange/40 hud-bar">
      <img
        src="/assets/generated/minimap-bg.dim_256x256.png"
        alt="Map"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-background/30" />

      {/* Landmarks */}
      {LANDMARKS.map((lm) => (
        <div
          key={lm.name}
          className="absolute text-[8px] transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${lm.x}%`, top: `${lm.z}%` }}
          title={lm.name}
        >
          {lm.icon}
        </div>
      ))}

      {/* Player dot */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-neon-orange border border-white transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"
        style={{ left: `${Math.max(5, Math.min(95, px))}%`, top: `${Math.max(5, Math.min(95, pz))}%` }}
      />

      {/* Label */}
      <div className="absolute bottom-1 left-1 right-1 text-center">
        <span className="font-gaming text-[7px] text-neon-orange/80 tracking-wider">MAPLEWOOD</span>
      </div>
    </div>
  );
}
