import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Terrain from './Terrain';
import NPCManager from './NPCManager';
import AnimalManager from './AnimalManager';
import VehicleManager from './VehicleManager';
import BiomeZones from './BiomeZones';

interface WorldProps {
  playerPos: React.MutableRefObject<THREE.Vector3>;
  wantedLevel: number;
  violenceEnabled: boolean;
  onInteract: (text: string) => void;
}

export default function World({ playerPos, wantedLevel, violenceEnabled, onInteract }: WorldProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      const t = clock.getElapsedTime() * 0.005;
      sunRef.current.position.set(
        Math.sin(t) * 200,
        Math.abs(Math.cos(t)) * 200 + 50,
        Math.cos(t) * 100
      );
    }
  });

  return (
    <>
      {/* Sky & Atmosphere */}
      <Sky sunPosition={[100, 50, 100]} turbidity={8} rayleigh={2} />
      <Stars radius={300} depth={50} count={2000} factor={4} fade />

      {/* Fog via primitive */}
      <fog attach="fog" args={['#87CEEB', 80, 450]} />

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#fff8e7" />
      <directionalLight
        ref={sunRef}
        position={[100, 150, 100]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        color="#fff8e7"
      />
      <pointLight position={[0, 30, 0]} intensity={0.3} color="#ff8844" />
      <hemisphereLight args={['#87CEEB', '#4a7c3f', 0.4]} />

      {/* Terrain */}
      <Terrain />

      {/* Biome Zones */}
      <BiomeZones onInteract={onInteract} />

      {/* NPCs */}
      <NPCManager
        playerPos={playerPos}
        wantedLevel={wantedLevel}
        violenceEnabled={violenceEnabled}
        onInteract={onInteract}
      />

      {/* Animals */}
      <AnimalManager playerPos={playerPos} />

      {/* Vehicles */}
      <VehicleManager playerPos={playerPos} onInteract={onInteract} />
    </>
  );
}
