import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AnimalManagerProps {
  playerPos: React.MutableRefObject<THREE.Vector3>;
}

type AnimalType = 'deer' | 'wolf' | 'bear' | 'bird' | 'fish';
type AnimalState = 'idle' | 'roaming' | 'fleeing' | 'attacking';

interface AnimalData {
  id: string;
  type: AnimalType;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  isAlive: boolean;
  state: AnimalState;
}

const ANIMAL_COLORS: Record<AnimalType, string> = {
  deer: '#c8a46e',
  wolf: '#888888',
  bear: '#6b4226',
  bird: '#334455',
  fish: '#4488cc',
};

const ANIMAL_SIZES: Record<AnimalType, [number, number, number]> = {
  deer: [0.6, 1.2, 1.4],
  wolf: [0.5, 0.8, 1.2],
  bear: [1.2, 1.5, 1.8],
  bird: [0.3, 0.2, 0.4],
  fish: [0.2, 0.15, 0.5],
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

function AnimalMesh({ animal }: { animal: AnimalData }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = ANIMAL_COLORS[animal.type];
  const size = ANIMAL_SIZES[animal.type];

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.lerp(animal.position, 0.08);
    if (animal.state !== 'idle') {
      groupRef.current.lookAt(animal.targetPosition);
    }
  });

  if (!animal.isAlive) return null;

  const yPos = animal.type === 'bird' ? 8 : animal.type === 'fish' ? 0.3 : 0;

  return (
    <group ref={groupRef} position={[animal.position.x, yPos, animal.position.z]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, size[1] * 0.6, size[2] * 0.5]} castShadow>
        <boxGeometry args={[size[0] * 0.7, size[1] * 0.5, size[2] * 0.4]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Legs (for ground animals) */}
      {animal.type !== 'bird' && animal.type !== 'fish' && (
        <>
          {(
            [
              [-0.3, -0.3],
              [0.3, -0.3],
              [-0.3, 0.3],
              [0.3, 0.3],
            ] as Array<[number, number]>
          ).map(([lx, lz], i) => (
            <mesh key={i} position={[lx * size[0], -size[1] * 0.5, lz * size[2]]}>
              <cylinderGeometry args={[0.08, 0.08, size[1] * 0.6, 4]} />
              <meshLambertMaterial color={color} />
            </mesh>
          ))}
        </>
      )}
      {/* Wings for birds */}
      {animal.type === 'bird' && (
        <>
          <mesh position={[size[0], 0, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[size[0] * 1.5, 0.05, size[2] * 0.8]} />
            <meshLambertMaterial color={color} />
          </mesh>
          <mesh position={[-size[0], 0, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[size[0] * 1.5, 0.05, size[2] * 0.8]} />
            <meshLambertMaterial color={color} />
          </mesh>
        </>
      )}
      {/* Danger indicator for aggressive animals */}
      {(animal.type === 'wolf' || animal.type === 'bear') && animal.state === 'attacking' && (
        <pointLight position={[0, 2, 0]} intensity={1.5} color="#ff2200" distance={8} />
      )}
    </group>
  );
}

export default function AnimalManager({ playerPos }: AnimalManagerProps) {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const frameCount = useRef(0);

  useEffect(() => {
    const initialAnimals: AnimalData[] = [];
    const configs: Array<{ type: AnimalType; count: number; zone: [number, number, number, number] }> = [
      { type: 'deer', count: 8, zone: [100, 250, 50, 200] },
      { type: 'wolf', count: 4, zone: [150, 300, 100, 250] },
      { type: 'bear', count: 3, zone: [-300, -150, -300, -150] },
      { type: 'bird', count: 10, zone: [-200, 200, -200, 200] },
      { type: 'fish', count: 6, zone: [-130, -70, 70, 130] },
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
          state: 'idle',
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
          newState = 'attacking';
          newTarget = playerPos.current.clone();
          speed = 0.4;
        } else if (fleeRange > 0 && distToPlayer < fleeRange) {
          newState = 'fleeing';
          newTarget = animal.position.clone().add(
            animal.position.clone().sub(playerPos.current).normalize().multiplyScalar(30)
          );
          speed = 0.5;
        } else {
          newState = 'roaming';
          speed = 0.1;
          if (animal.position.distanceTo(animal.targetPosition) < 3) {
            newTarget = new THREE.Vector3(
              animal.position.x + (Math.random() - 0.5) * 40,
              0,
              animal.position.z + (Math.random() - 0.5) * 40
            );
          }
        }

        // All active states (attacking, fleeing, roaming) move toward their target
        const dir = newTarget.clone().sub(animal.position);
        if (dir.length() > 0.01) {
          dir.normalize();
          newPos = animal.position.clone().add(dir.multiplyScalar(speed));
        }

        return { ...animal, state: newState, position: newPos, targetPosition: newTarget };
      })
    );
  });

  return (
    <group>
      {animals.map((animal) => (
        <AnimalMesh key={animal.id} animal={animal} />
      ))}
    </group>
  );
}
