import { Sky, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
import type * as THREE from "three";
import { getInteriorLayout } from "../../utils/buildingInteriors";
import AnimalManager from "./AnimalManager";
import BiomeZones from "./BiomeZones";
import BuildingInteriorManager from "./BuildingInteriorManager";
import NPCManager from "./NPCManager";
import Terrain from "./Terrain";
import VehicleManager from "./VehicleManager";

interface WorldProps {
  playerPos: React.MutableRefObject<THREE.Vector3>;
  wantedLevel: number;
  violenceEnabled: boolean;
  onInteract: (text: string) => void;
  // Career / interior props (optional for backward compat)
  playerJob?: string;
  isInsideBuilding?: boolean;
  currentBuildingType?: string | null;
  onEnterBuilding?: (buildingType: string, outdoorPos: THREE.Vector3) => void;
  onExitBuilding?: () => void;
  onPickupItem?: (itemId: string, itemType: string, label: string) => void;
  onArrestNPC?: () => void;
  onHealNPC?: () => void;
}

export default function World({
  playerPos,
  wantedLevel,
  violenceEnabled,
  onInteract,
  playerJob = "unemployed",
  isInsideBuilding = false,
  currentBuildingType = null,
  onEnterBuilding,
  onExitBuilding,
  onPickupItem,
  onArrestNPC,
  onHealNPC,
}: WorldProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      const t = clock.getElapsedTime() * 0.005;
      sunRef.current.position.set(
        Math.sin(t) * 200,
        Math.abs(Math.cos(t)) * 200 + 50,
        Math.cos(t) * 100,
      );
      sunRef.current.shadow.camera.updateProjectionMatrix();
    }
  });

  const handleEnterBuilding = useCallback(
    (buildingType: string) => {
      onEnterBuilding?.(buildingType, playerPos.current.clone());
    },
    [onEnterBuilding, playerPos],
  );

  const handlePickupItem = useCallback(
    (itemId: string, itemType: string, label: string) => {
      onPickupItem?.(itemId, itemType, label);
      onInteract(`Picked up: ${label}`);
    },
    [onPickupItem, onInteract],
  );

  const interiorLayout = currentBuildingType
    ? getInteriorLayout(currentBuildingType)
    : null;

  return (
    <>
      {/* Sky & Atmosphere */}
      <Sky
        sunPosition={[100, 50, 100]}
        turbidity={6}
        rayleigh={1.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <Stars radius={300} depth={50} count={3000} factor={4} fade />

      {/* Atmospheric fog */}
      <fog attach="fog" args={["#87CEEB", 100, 500]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} color="#c8d8f0" />
      <directionalLight
        ref={sunRef}
        position={[100, 150, 100]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={600}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
        shadow-bias={-0.0005}
        color="#fff5e0"
      />
      <hemisphereLight args={["#87CEEB", "#4a7c3f", 0.6]} />
      <directionalLight
        position={[-80, 60, -80]}
        intensity={0.4}
        color="#b0c8ff"
      />
      <pointLight
        position={[0, 30, 0]}
        intensity={0.5}
        color="#ff9944"
        distance={200}
      />

      {/* Interior scene */}
      {isInsideBuilding && interiorLayout && (
        <BuildingInteriorManager
          layout={interiorLayout}
          onExit={() => onExitBuilding?.()}
          playerPosition={playerPos}
          onPickupItem={handlePickupItem}
        />
      )}

      {/* Outdoor scene */}
      {!isInsideBuilding && (
        <>
          <Terrain />
          <BiomeZones
            onInteract={onInteract}
            playerJob={playerJob}
            onEnterBuilding={handleEnterBuilding}
            playerPosition={playerPos}
          />
          <NPCManager
            playerPos={playerPos}
            wantedLevel={wantedLevel}
            violenceEnabled={violenceEnabled}
            onInteract={onInteract}
            playerJob={playerJob}
            onArrestNPC={onArrestNPC}
            onHealNPC={onHealNPC}
          />
          <AnimalManager
            playerPos={playerPos}
            violenceEnabled={violenceEnabled}
          />
          <VehicleManager playerPos={playerPos} onInteract={onInteract} />
        </>
      )}
    </>
  );
}
