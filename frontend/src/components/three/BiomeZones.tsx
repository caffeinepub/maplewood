import { useState, useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface BiomeZonesProps {
  onInteract: (text: string) => void;
}

function Building({
  position,
  size,
  color,
  label,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label?: string;
}) {
  const windowRows = Math.floor(size[1] / 4);
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshLambertMaterial color={color} />
      </mesh>
      {Array.from({ length: windowRows }).map((_, floor) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh
            key={`w-${floor}-${col}`}
            position={[
              -size[0] / 2 + (col + 1) * (size[0] / 4),
              floor * 4 + 2,
              size[2] / 2 + 0.05,
            ]}
          >
            <planeGeometry args={[1.2, 1.8]} />
            <meshLambertMaterial color={col % 2 === 0 ? '#ffee88' : '#334455'} />
          </mesh>
        ))
      )}
      {label && (
        <Text
          position={[0, size[1] + 1.5, 0]}
          fontSize={1.5}
          color="#ff6600"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.1}
          outlineColor="#000000"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

function Tree({ position, chopped }: { position: [number, number, number]; chopped: boolean }) {
  if (chopped) return null;
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 4, 6]} />
        <meshLambertMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <coneGeometry args={[3, 6, 7]} />
        <meshLambertMaterial color="#2d5a1b" />
      </mesh>
      <mesh position={[0, 9, 0]} castShadow>
        <coneGeometry args={[2, 4, 7]} />
        <meshLambertMaterial color="#3a7a25" />
      </mesh>
    </group>
  );
}

function Road({
  start,
  end,
  width = 8,
}: {
  start: [number, number, number];
  end: [number, number, number];
  width?: number;
}) {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  return (
    <mesh position={[midX, 0.15, midZ]} rotation={[0, angle, 0]}>
      <planeGeometry args={[width, length]} />
      <meshLambertMaterial color="#333333" />
    </mesh>
  );
}

function House({ position, colorIndex }: { position: [number, number, number]; colorIndex: number }) {
  const wallColors = ['#cc8844', '#aa6633', '#bb7755', '#dd9966', '#cc7744'];
  const roofColors = ['#882222', '#663311', '#772233', '#993322', '#882211'];
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[10, 6, 8]} />
        <meshLambertMaterial color={wallColors[colorIndex % wallColors.length]} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <coneGeometry args={[7, 4, 4]} />
        <meshLambertMaterial color={roofColors[colorIndex % roofColors.length]} />
      </mesh>
    </group>
  );
}

export default function BiomeZones({ onInteract }: BiomeZonesProps) {
  const [choppedTrees, setChoppedTrees] = useState<Set<number>>(new Set());

  const cityBuildings: Array<{
    pos: [number, number, number];
    size: [number, number, number];
    color: string;
    label?: string;
  }> = [
    { pos: [-30, 0, -20], size: [12, 30, 12], color: '#445566', label: 'City Hall' },
    { pos: [-10, 0, -30], size: [10, 40, 10], color: '#556677' },
    { pos: [20, 0, -15], size: [14, 24, 14], color: '#667788', label: 'Hotel' },
    { pos: [40, 0, 10], size: [16, 16, 12], color: '#334455', label: 'Police HQ' },
    { pos: [-50, 0, 20], size: [20, 12, 15], color: '#445533', label: 'Mall' },
    { pos: [60, 0, -40], size: [25, 10, 20], color: '#554433', label: 'Dealership' },
    { pos: [-20, 0, 40], size: [12, 8, 10], color: '#443322', label: 'Restaurant' },
    { pos: [10, 0, 50], size: [10, 6, 8], color: '#334422', label: 'Café' },
    { pos: [80, 0, 30], size: [30, 8, 40], color: '#555544', label: 'Airport Terminal' },
    { pos: [-60, 0, -50], size: [15, 6, 12], color: '#443355', label: 'Nightclub' },
    { pos: [0, 0, -60], size: [18, 20, 14], color: '#556644', label: 'Office Tower' },
    { pos: [-40, 0, -60], size: [14, 14, 12], color: '#445566', label: 'Bank' },
  ];

  const forestTrees = useMemo(() => {
    const trees: Array<[number, number, number]> = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2;
      const radius = 150 + Math.random() * 200;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 60;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 60;
      trees.push([x, 0, z]);
    }
    return trees;
  }, []);

  const handleChopTree = (idx: number) => {
    setChoppedTrees((prev) => new Set([...prev, idx]));
    onInteract('Tree chopped! +1 Wood');
  };

  return (
    <group>
      {/* Roads */}
      <Road start={[-200, 0, 0]} end={[200, 0, 0]} />
      <Road start={[0, 0, -200]} end={[0, 0, 200]} />
      <Road start={[-200, 0, -50]} end={[200, 0, -50]} />
      <Road start={[-200, 0, 50]} end={[200, 0, 50]} />
      <Road start={[-50, 0, -200]} end={[-50, 0, 200]} />
      <Road start={[50, 0, -200]} end={[50, 0, 200]} />

      {/* City Buildings */}
      {cityBuildings.map((b, i) => (
        <Building key={i} position={b.pos} size={b.size} color={b.color} label={b.label} />
      ))}

      {/* Neighborhood houses */}
      {Array.from({ length: 20 }).map((_, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        return (
          <House
            key={`house-${i}`}
            position={[-150 + col * 25, 0, 80 + row * 20]}
            colorIndex={i}
          />
        );
      })}

      {/* Forest trees */}
      {forestTrees.map((pos, i) => (
        <group key={`tree-${i}`} onClick={() => handleChopTree(i)}>
          <Tree position={pos} chopped={choppedTrees.has(i)} />
        </group>
      ))}

      {/* Mountain ski resort */}
      <group position={[-280, 50, -280]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[30, 10, 20]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        <Text
          position={[0, 12, 0]}
          fontSize={3}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.15}
          outlineColor="#000000"
        >
          SKI LODGE
        </Text>
        {/* Ski slopes */}
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} position={[i * 15 - 15, -10, 20]} rotation={[-0.3, 0, 0]}>
            <planeGeometry args={[12, 60]} />
            <meshLambertMaterial color="#e8f4f8" />
          </mesh>
        ))}
        {/* Ski lift poles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`pole-${i}`} position={[0, 5 + i * 3, -10 + i * 8]}>
            <cylinderGeometry args={[0.3, 0.3, 10, 6]} />
            <meshLambertMaterial color="#888888" />
          </mesh>
        ))}
      </group>

      {/* Airport runway */}
      <mesh position={[100, 0.2, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 120]} />
        <meshLambertMaterial color="#222222" />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`runway-${i}`} position={[100, 0.25, -30 + i * 12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 6]} />
          <meshLambertMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Pool / Resort area */}
      <group position={[30, 0.3, 80]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 15]} />
          <meshLambertMaterial color="#1a8fbf" transparent opacity={0.85} />
        </mesh>
        <Text
          position={[0, 2, 10]}
          fontSize={2}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.1}
          outlineColor="#000000"
        >
          RESORT POOL
        </Text>
        {/* Lounge chairs */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={`chair-${i}`} position={[-8 + i * 3, 0.5, 12]}>
            <boxGeometry args={[2, 0.3, 1]} />
            <meshLambertMaterial color="#ff8844" />
          </mesh>
        ))}
      </group>

      {/* Lake */}
      <mesh position={[-100, 0.4, 100]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshLambertMaterial color="#1a6b9a" transparent opacity={0.8} />
      </mesh>
      <Text
        position={[-100, 2, 70]}
        fontSize={2}
        color="#88ccff"
        anchorX="center"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        MAPLEWOOD LAKE
      </Text>

      {/* River */}
      <mesh position={[-150, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[15, 300]} />
        <meshLambertMaterial color="#1a6b9a" transparent opacity={0.75} />
      </mesh>

      {/* Party venue */}
      <group position={[-60, 0, -50]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[25, 8, 20]} />
          <meshLambertMaterial color="#2a1a3a" />
        </mesh>
        <Text
          position={[0, 9, 0]}
          fontSize={2}
          color="#ff44aa"
          anchorX="center"
          outlineWidth={0.1}
          outlineColor="#000000"
        >
          CLUB MAPLE
        </Text>
        {/* Colored lights */}
        <pointLight position={[0, 6, 0]} intensity={2} color="#ff44aa" distance={20} />
        <pointLight position={[5, 6, 5]} intensity={1.5} color="#4444ff" distance={15} />
      </group>

      {/* Hotel building */}
      <group position={[20, 0, -15]}>
        <mesh position={[0, 12, 0]} castShadow>
          <boxGeometry args={[14, 24, 14]} />
          <meshLambertMaterial color="#667788" />
        </mesh>
        {/* Hotel sign */}
        <Text
          position={[0, 25, 8]}
          fontSize={2}
          color="#ffcc00"
          anchorX="center"
          outlineWidth={0.1}
          outlineColor="#000000"
        >
          MAPLE GRAND HOTEL
        </Text>
      </group>

      {/* Police station */}
      <group position={[40, 0, 10]}>
        <mesh position={[0, 8, 0]} castShadow>
          <boxGeometry args={[16, 16, 12]} />
          <meshLambertMaterial color="#334455" />
        </mesh>
        <pointLight position={[0, 10, 8]} intensity={1} color="#4444ff" distance={20} />
        <Text
          position={[0, 17, 7]}
          fontSize={1.5}
          color="#4488ff"
          anchorX="center"
          outlineWidth={0.1}
          outlineColor="#000000"
        >
          MAPLEWOOD PD
        </Text>
      </group>

      {/* Car dealership */}
      <group position={[60, 0, -40]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[25, 10, 20]} />
          <meshLambertMaterial color="#554433" />
        </mesh>
        <Text
          position={[0, 11, 11]}
          fontSize={2}
          color="#ffcc00"
          anchorX="center"
          outlineWidth={0.1}
          outlineColor="#000000"
        >
          MAPLE AUTO
        </Text>
        {/* Display cars */}
        {[-8, 0, 8].map((x, i) => (
          <group key={`display-car-${i}`} position={[x, 0.5, -30]}>
            <mesh>
              <boxGeometry args={[4, 1.5, 2]} />
              <meshLambertMaterial color={['#cc2222', '#2244cc', '#22aa44'][i]} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[2.5, 1, 1.8]} />
              <meshLambertMaterial color={['#cc2222', '#2244cc', '#22aa44'][i]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Mountain trees */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const r = 220 + Math.random() * 80;
        return (
          <group key={`mtree-${i}`} position={[Math.cos(angle) * r - 100, 20, Math.sin(angle) * r - 100]}>
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.4, 0.6, 5, 6]} />
              <meshLambertMaterial color="#5c3d1e" />
            </mesh>
            <mesh position={[0, 7, 0]}>
              <coneGeometry args={[3.5, 7, 7]} />
              <meshLambertMaterial color="#1a4a10" />
            </mesh>
          </group>
        );
      })}

      {/* Rocks */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={`rock-${i}`}
          position={[
            -200 + Math.random() * 400,
            0.5,
            -200 + Math.random() * 400,
          ]}
          castShadow
        >
          <dodecahedronGeometry args={[1 + Math.random() * 2, 0]} />
          <meshLambertMaterial color="#888877" />
        </mesh>
      ))}
    </group>
  );
}
