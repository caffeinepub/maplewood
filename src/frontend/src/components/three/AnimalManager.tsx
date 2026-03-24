import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface AnimalManagerProps {
  playerPos: React.MutableRefObject<THREE.Vector3>;
  violenceEnabled?: boolean;
}

type AnimalType = "deer" | "wolf" | "bear" | "bird" | "fish";
type AnimalState = "idle" | "roaming" | "fleeing" | "attacking";

interface AnimalData {
  id: string;
  type: AnimalType;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  isAlive: boolean;
  state: AnimalState;
}

// Photorealistic animal images from Unsplash
const ANIMAL_IMAGES: Record<AnimalType, string> = {
  deer: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=256&h=256&fit=crop",
  wolf: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=256&h=256&fit=crop",
  bear: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=256&h=256&fit=crop",
  bird: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=256&h=256&fit=crop",
  fish: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=256&h=256&fit=crop",
};

const ANIMAL_BILLBOARD_SIZE: Record<AnimalType, [number, number]> = {
  deer: [2.0, 2.0],
  wolf: [1.8, 1.4],
  bear: [2.4, 2.2],
  bird: [0.8, 0.6],
  fish: [0.8, 0.4],
};

const AGGRO_RANGE: Record<AnimalType, number> = {
  deer: 0,
  wolf: 15,
  bear: 20,
  bird: 0,
  fish: 0,
};

const FLEE_RANGE: Record<AnimalType, number> = {
  deer: 12,
  wolf: 0,
  bear: 0,
  bird: 8,
  fish: 5,
};

function useAnimalTexture(type: AnimalType) {
  const url = ANIMAL_IMAGES[type];
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [url]);
}

function BloodSplatter({
  position,
  active,
}: { position: THREE.Vector3; active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useRef<
    Array<{ pos: THREE.Vector3; vel: THREE.Vector3; life: number }>
  >([]);
  const initialized = useRef(false);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(20 * 3);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xaa0000,
        size: 0.12,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      }),
    [],
  );

  useEffect(() => {
    if (!active || initialized.current) return;
    initialized.current = true;
    particles.current = Array.from({ length: 20 }, () => ({
      pos: position.clone(),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 3,
      ),
      life: 1.0,
    }));
  }, [active, position]);

  useFrame((_, delta) => {
    if (!active || !pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    particles.current.forEach((p, i) => {
      if (p.life <= 0) return;
      p.life -= delta * 1.2;
      p.vel.y -= 9.8 * delta;
      p.pos.addScaledVector(p.vel, delta);
      attr.setXYZ(i, p.pos.x, Math.max(p.pos.y, 0.05), p.pos.z);
    });
    attr.needsUpdate = true;
    (pointsRef.current.material as THREE.PointsMaterial).opacity =
      Math.max(0, particles.current[0]?.life ?? 0) * 0.85;
  });

  if (!active) return null;
  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

function AnimalMesh({
  animal,
  violenceEnabled,
}: {
  animal: AnimalData;
  violenceEnabled: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useAnimalTexture(animal.type);
  const [showBlood, setShowBlood] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const billboardSize = ANIMAL_BILLBOARD_SIZE[animal.type];

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(animal.position, 0.08);
  });

  useEffect(() => {
    if (!animal.isAlive && !isDead) {
      setIsDead(true);
      if (violenceEnabled) setShowBlood(true);
    }
  }, [animal.isAlive, isDead, violenceEnabled]);

  if (!animal.isAlive && !showBlood) return null;

  const yPos = animal.type === "bird" ? 8 : animal.type === "fish" ? 0.3 : 0;

  return (
    <>
      {violenceEnabled && showBlood && (
        <>
          <BloodSplatter position={animal.position} active={showBlood} />
          {isDead && (
            <mesh
              position={[animal.position.x, 0.05, animal.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.6, 10]} />
              <meshStandardMaterial
                color={0x8b0000}
                transparent
                opacity={0.8}
                roughness={0.9}
              />
            </mesh>
          )}
        </>
      )}

      {animal.isAlive && (
        <group
          ref={groupRef}
          position={[animal.position.x, yPos, animal.position.z]}
        >
          <Billboard follow lockX={false} lockY={false} lockZ={false}>
            <mesh castShadow>
              <planeGeometry args={billboardSize} />
              <meshStandardMaterial
                map={texture}
                transparent
                alphaTest={0.1}
                roughness={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Billboard>

          {/* Shadow — use circleGeometry instead of ellipseGeometry */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[billboardSize[0] * 0.3, 8]} />
            <meshBasicMaterial color={0x000000} transparent opacity={0.25} />
          </mesh>

          {/* Danger glow for aggressive animals */}
          {(animal.type === "wolf" || animal.type === "bear") &&
            animal.state === "attacking" && (
              <pointLight
                position={[0, 1.5, 0]}
                intensity={1.5}
                color="#ff2200"
                distance={8}
              />
            )}
        </group>
      )}
    </>
  );
}

export default function AnimalManager({
  playerPos,
  violenceEnabled = true,
}: AnimalManagerProps) {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const frameCount = useRef(0);

  useEffect(() => {
    const initialAnimals: AnimalData[] = [];
    const configs: Array<{
      type: AnimalType;
      count: number;
      zone: [number, number, number, number];
    }> = [
      { type: "deer", count: 8, zone: [100, 250, 50, 200] },
      { type: "wolf", count: 4, zone: [150, 300, 100, 250] },
      { type: "bear", count: 3, zone: [-300, -150, -300, -150] },
      { type: "bird", count: 10, zone: [-200, 200, -200, 200] },
      { type: "fish", count: 6, zone: [-130, -70, 70, 130] },
    ];

    let id = 0;
    for (const cfg of configs) {
      for (let i = 0; i < cfg.count; i++) {
        const x = cfg.zone[0] + Math.random() * (cfg.zone[1] - cfg.zone[0]);
        const z = cfg.zone[2] + Math.random() * (cfg.zone[3] - cfg.zone[2]);
        const pos = new THREE.Vector3(x, 0, z);
        initialAnimals.push({
          id: `animal-${id++}`,
          type: cfg.type,
          position: pos.clone(),
          targetPosition: pos.clone(),
          isAlive: true,
          state: "idle",
        });
      }
    }
    setAnimals(initialAnimals);
  }, []);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 20 !== 0) return;

    setAnimals((prev) =>
      prev.map((animal) => {
        if (!animal.isAlive) return animal;

        const distToPlayer = animal.position.distanceTo(playerPos.current);
        let newPos = animal.position.clone();
        let newTarget = animal.targetPosition.clone();
        let newState: AnimalState;
        let speed: number;

        const aggroRange = AGGRO_RANGE[animal.type];
        const fleeRange = FLEE_RANGE[animal.type];

        if (aggroRange > 0 && distToPlayer < aggroRange) {
          newState = "attacking";
          newTarget = playerPos.current.clone();
          speed = 0.4;
        } else if (fleeRange > 0 && distToPlayer < fleeRange) {
          newState = "fleeing";
          newTarget = animal.position
            .clone()
            .add(
              animal.position
                .clone()
                .sub(playerPos.current)
                .normalize()
                .multiplyScalar(30),
            );
          speed = 0.5;
        } else {
          newState = "roaming";
          speed = 0.1;
          if (animal.position.distanceTo(animal.targetPosition) < 3) {
            newTarget = new THREE.Vector3(
              animal.position.x + (Math.random() - 0.5) * 40,
              0,
              animal.position.z + (Math.random() - 0.5) * 40,
            );
          }
        }

        const dir = newTarget.clone().sub(animal.position);
        if (dir.length() > 0.01) {
          dir.normalize();
          newPos = animal.position.clone().add(dir.multiplyScalar(speed));
        }

        return {
          ...animal,
          state: newState,
          position: newPos,
          targetPosition: newTarget,
        };
      }),
    );
  });

  return (
    <group>
      {animals.map((animal) => (
        <AnimalMesh
          key={animal.id}
          animal={animal}
          violenceEnabled={violenceEnabled}
        />
      ))}
    </group>
  );
}
