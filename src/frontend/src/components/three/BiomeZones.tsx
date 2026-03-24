import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

interface BiomeZonesProps {
  onInteract: (text: string) => void;
  playerJob?: string;
  onEnterBuilding?: (buildingType: string) => void;
  playerPosition?: React.MutableRefObject<THREE.Vector3>;
}

// Texture URLs for buildings
const BUILDING_TEXTURES = {
  glass:
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=512&h=512&fit=crop",
  brick:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop",
  concrete:
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=512&h=512&fit=crop",
  wood: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=512&h=512&fit=crop",
  metal:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop",
};

const TREE_FOLIAGE_URL =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=256&h=256&fit=crop";
const TREE_BARK_URL =
  "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=128&h=256&fit=crop";
const ROAD_TEXTURE_URL =
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=512&h=512&fit=crop";

function useBuildingTexture(type: keyof typeof BUILDING_TEXTURES) {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(BUILDING_TEXTURES[type]);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [type]);
}

// Building with optional door entry interaction
function Building({
  position,
  size,
  textureType = "glass",
  label,
  buildingType,
  onEnterBuilding,
  playerPosition,
}: {
  position: [number, number, number];
  size: [number, number, number];
  textureType?: keyof typeof BUILDING_TEXTURES;
  label?: string;
  buildingType?: string;
  onEnterBuilding?: (buildingType: string) => void;
  playerPosition?: React.MutableRefObject<THREE.Vector3>;
}) {
  const texture = useBuildingTexture(textureType);
  const windowRows = Math.floor(size[1] / 4);
  const [nearDoor, setNearDoor] = React.useState(false);

  // Door world position (front face center, ground level)
  const doorWorldPos = useMemo(() => {
    return new THREE.Vector3(
      position[0],
      position[1],
      position[2] + size[2] / 2,
    );
  }, [position, size]);

  useFrame(() => {
    if (!playerPosition?.current || !buildingType) return;
    const dist = playerPosition.current.distanceTo(doorWorldPos);
    setNearDoor(dist < 4);
  });

  // E key listener when near door
  React.useEffect(() => {
    if (!nearDoor || !buildingType || !onEnterBuilding) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE") {
        onEnterBuilding(buildingType);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nearDoor, buildingType, onEnterBuilding]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Window lights */}
      {Array.from({ length: windowRows }).map((_, floor) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh
            // biome-ignore lint/suspicious/noArrayIndexKey: positional keys are stable for static arrays
            key={`w-${floor}-${col}`}
            position={[
              -size[0] / 2 + (col + 1) * (size[0] / 4),
              floor * 4 + 2,
              size[2] / 2 + 0.05,
            ]}
          >
            <planeGeometry args={[1.2, 1.8]} />
            <meshStandardMaterial
              color={col % 2 === 0 ? "#ffee88" : "#334455"}
              emissive={
                col % 2 === 0
                  ? new THREE.Color(0.3, 0.25, 0.0)
                  : new THREE.Color(0, 0, 0)
              }
              roughness={0.1}
            />
          </mesh>
        )),
      )}
      {/* Door */}
      {buildingType && (
        <mesh position={[0, 1.1, size[2] / 2 + 0.05]} castShadow>
          <boxGeometry args={[1.0, 2.2, 0.1]} />
          <meshStandardMaterial color="#5a3a1a" />
        </mesh>
      )}
      {label && (
        <Billboard position={[0, size[1] + 1.5, 0]}>
          <Text
            fontSize={1.5}
            color="#ff6600"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.1}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </Billboard>
      )}
      {/* Entry prompt */}
      {nearDoor && buildingType && (
        <Billboard position={[0, 3.5, size[2] / 2 + 0.5]}>
          <Text
            fontSize={0.5}
            color="#ffff00"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {`[E] Enter ${label ?? "Building"}`}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function Tree({
  position,
  chopped,
}: { position: [number, number, number]; chopped: boolean }) {
  const foliageTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(TREE_FOLIAGE_URL);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const barkTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(TREE_BARK_URL);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  if (chopped) return null;
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial
          map={barkTexture}
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <coneGeometry args={[3, 6, 8]} />
        <meshStandardMaterial
          map={foliageTexture}
          roughness={0.9}
          metalness={0.0}
          color={0x3a7a25}
        />
      </mesh>
      <mesh position={[0, 9, 0]} castShadow>
        <coneGeometry args={[2, 4, 8]} />
        <meshStandardMaterial
          map={foliageTexture}
          roughness={0.9}
          metalness={0.0}
          color={0x4a9a30}
        />
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
  const roadTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(ROAD_TEXTURE_URL);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: roadTexture,
      roughness: 0.95,
      metalness: 0.0,
      color: 0x444444,
    });
    m.map!.repeat.set(1, length / 8);
    return m;
  }, [roadTexture, length]);

  return (
    <mesh position={[midX, 0.15, midZ]} rotation={[0, angle, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function House({
  position,
  colorIndex,
}: { position: [number, number, number]; colorIndex: number }) {
  const wallTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const urls = [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=256&h=256&fit=crop",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=256&h=256&fit=crop",
    ];
    const tex = loader.load(urls[colorIndex % urls.length]);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [colorIndex]);

  const roofColors = ["#8b2222", "#225588", "#228822", "#886622", "#662288"];
  const roofColor = roofColors[colorIndex % roofColors.length];

  return (
    <group position={position}>
      {/* House body */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 4, 7]} />
        <meshStandardMaterial map={wallTexture} roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[6.5, 3, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.9} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 1.1, 3.55]} castShadow>
        <boxGeometry args={[1.2, 2.2, 0.1]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      {/* Windows */}
      <mesh position={[-2.5, 2.5, 3.55]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial color="#88aacc" transparent opacity={0.7} />
      </mesh>
      <mesh position={[2.5, 2.5, 3.55]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial color="#88aacc" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function BiomeZones({
  onInteract: _onInteract,
  playerJob: _playerJob,
  onEnterBuilding,
  playerPosition,
}: BiomeZonesProps) {
  const treePositions = useMemo<[number, number, number][]>(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 + Math.sin(i * 1.7) * 0.5;
      const radius = 80 + Math.sin(i * 2.3) * 40;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.push([x, 0, z]);
    }
    return positions;
  }, []);

  const buildingProps = { onEnterBuilding, playerPosition };

  return (
    <group>
      {/* === CITY CENTER BUILDINGS === */}
      <Building
        position={[-20, 0, -15]}
        size={[12, 5, 10]}
        textureType="concrete"
        label="Police Station"
        buildingType="policeStation"
        {...buildingProps}
      />
      <Building
        position={[20, 0, -15]}
        size={[14, 6, 12]}
        textureType="glass"
        label="Hospital"
        buildingType="hospital"
        {...buildingProps}
      />
      <Building
        position={[0, 0, -30]}
        size={[16, 4, 12]}
        textureType="glass"
        label="Car Dealership"
        buildingType="dealership"
        {...buildingProps}
      />
      <Building
        position={[-35, 0, 10]}
        size={[12, 8, 10]}
        textureType="brick"
        label="Hotel"
        buildingType="hotel"
        {...buildingProps}
      />
      <Building
        position={[50, 0, 50]}
        size={[20, 5, 14]}
        textureType="glass"
        label="Airport Terminal"
        buildingType="airport"
        {...buildingProps}
      />

      {/* === COMMERCIAL BUILDINGS (no interior) === */}
      <Building
        position={[-5, 0, -20]}
        size={[8, 4, 7]}
        textureType="brick"
        label="Grocery Store"
      />
      <Building
        position={[5, 0, -20]}
        size={[7, 3.5, 6]}
        textureType="concrete"
        label="Pharmacy"
      />
      <Building
        position={[-15, 0, -5]}
        size={[9, 5, 8]}
        textureType="glass"
        label="Office Building"
      />
      <Building
        position={[15, 0, -5]}
        size={[8, 4, 7]}
        textureType="brick"
        label="Restaurant"
      />
      <Building
        position={[30, 0, -10]}
        size={[10, 6, 9]}
        textureType="glass"
        label="Apartment Block"
      />
      <Building
        position={[-30, 0, -10]}
        size={[10, 5, 8]}
        textureType="concrete"
        label="Shopping Mall"
      />

      {/* === SKI RESORT === */}
      <Building
        position={[0, 0, -80]}
        size={[14, 5, 10]}
        textureType="wood"
        label="Ski Lodge"
      />
      <Building
        position={[-15, 0, -80]}
        size={[8, 3, 6]}
        textureType="wood"
        label="Ski Rental"
      />

      {/* === PARTY VENUE === */}
      <Building
        position={[-50, 0, -20]}
        size={[16, 6, 14]}
        textureType="metal"
        label="Party Venue"
      />

      {/* === NEIGHBORHOOD HOMES === */}
      {[
        [-10, 0, 15] as [number, number, number],
        [10, 0, 15] as [number, number, number],
        [-10, 0, 25] as [number, number, number],
        [10, 0, 25] as [number, number, number],
        [25, 0, 10] as [number, number, number],
        [25, 0, 20] as [number, number, number],
        [-25, 0, 20] as [number, number, number],
        [-25, 0, 30] as [number, number, number],
      ].map((pos, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: positional keys are stable for static arrays
        <group key={`home-${i}`} position={pos}>
          <House position={[0, 0, 0]} colorIndex={i} />
          {/* Clickable door trigger for home entry */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: R3F 3D mesh does not support keyboard events */}
          <mesh
            position={[0, 1.1, 3.6]}
            onClick={() => onEnterBuilding?.("home")}
          >
            <boxGeometry args={[1.2, 2.2, 0.15]} />
            <meshStandardMaterial color="#5a3a1a" transparent opacity={0} />
          </mesh>
        </group>
      ))}

      {/* === ROADS === */}
      <Road start={[-200, 0, 0]} end={[200, 0, 0]} width={10} />
      <Road start={[0, 0, -200]} end={[0, 0, 200]} width={10} />
      <Road start={[-200, 0, 20]} end={[200, 0, 20]} width={8} />
      <Road start={[-200, 0, -20]} end={[200, 0, -20]} width={8} />
      <Road start={[-20, 0, -200]} end={[-20, 0, 200]} width={8} />
      <Road start={[20, 0, -200]} end={[20, 0, 200]} width={8} />

      {/* === FOREST TREES === */}
      {treePositions.map((pos, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: positional keys are stable for static arrays
        <Tree key={`tree-${i}`} position={pos} chopped={false} />
      ))}

      {/* Dense forest cluster */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = -150 + (i % 8) * 15 + Math.sin(i * 1.3) * 5;
        const z = -150 + Math.floor(i / 8) * 15 + Math.cos(i * 1.7) * 5;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: positional keys are stable for static arrays
          <Tree key={`forest-${i}`} position={[x, 0, z]} chopped={false} />
        );
      })}

      {/* === STREETLIGHTS === */}
      {[
        [-8, 0, -10],
        [8, 0, -10],
        [-8, 0, 10],
        [8, 0, 10],
        [-8, 0, -30],
        [8, 0, -30],
        [-8, 0, 30],
        [8, 0, 30],
        [-25, 0, 0],
        [25, 0, 0],
        [-25, 0, -20],
        [25, 0, -20],
      ].map((pos, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: positional keys are stable for static arrays
        <group key={`light-${i}`} position={pos as [number, number, number]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 5, 6]} />
            <meshStandardMaterial color="#606060" />
          </mesh>
          <mesh position={[0.8, 4.8, 0]} castShadow>
            <boxGeometry args={[1.6, 0.15, 0.3]} />
            <meshStandardMaterial color="#606060" />
          </mesh>
          <pointLight
            position={[0.8, 4.6, 0]}
            intensity={0.8}
            color="#ffe8a0"
            distance={15}
          />
        </group>
      ))}

      {/* === PARK AREA === */}
      <mesh
        position={[40, 0.1, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#4a8a2a" roughness={0.9} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <Tree
          // biome-ignore lint/suspicious/noArrayIndexKey: positional keys are stable for static arrays
          key={`park-tree-${i}`}
          position={[35 + (i % 4) * 7, 0, 25 + Math.floor(i / 4) * 10]}
          chopped={false}
        />
      ))}

      {/* === LAKE === */}
      <mesh
        position={[-80, 0.3, 60]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial
          color="#1a6b9a"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* === AIRPORT RUNWAY === */}
      <mesh
        position={[80, 0.1, 80]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial color="#333333" roughness={0.95} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          // biome-ignore lint/suspicious/noArrayIndexKey: positional keys are stable for static arrays
          key={`runway-mark-${i}`}
          position={[80, 0.15, 35 + i * 10]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1, 4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}
