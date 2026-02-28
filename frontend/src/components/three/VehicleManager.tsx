import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface VehicleManagerProps {
  playerPos: React.MutableRefObject<THREE.Vector3>;
  onInteract: (text: string) => void;
}

type VehicleType = 'car' | 'truck' | 'helicopter' | 'plane' | 'boat';

interface VehicleData {
  id: string;
  type: VehicleType;
  position: [number, number, number];
  color: string;
  label: string;
}

const PARKED_VEHICLES: VehicleData[] = [
  { id: 'v1', type: 'car', position: [-5, 0, 10], color: '#cc2222', label: 'Sedan' },
  { id: 'v2', type: 'car', position: [5, 0, 10], color: '#2244cc', label: 'Sports Car' },
  { id: 'v3', type: 'car', position: [15, 0, 10], color: '#22aa44', label: 'SUV' },
  { id: 'v4', type: 'truck', position: [-20, 0, 15], color: '#884422', label: 'Pickup Truck' },
  { id: 'v5', type: 'car', position: [30, 0, -5], color: '#aa22aa', label: 'Police Car' },
  { id: 'v6', type: 'helicopter', position: [80, 3, 30], color: '#888888', label: 'Helicopter' },
  { id: 'v7', type: 'plane', position: [100, 1, 20], color: '#ffffff', label: 'Cessna' },
  { id: 'v8', type: 'boat', position: [-100, 0.5, 100], color: '#2244aa', label: 'Speedboat' },
  { id: 'v9', type: 'boat', position: [-90, 0.5, 110], color: '#aa4422', label: 'Yacht' },
  { id: 'v10', type: 'car', position: [60, 0, -35], color: '#ffcc00', label: 'Dealership Car' },
];

function VehicleMesh({ vehicle, onEnter }: { vehicle: VehicleData; onEnter: () => void }) {
  const [hovered, setHovered] = useState(false);

  const dims: Record<VehicleType, [number, number, number]> = {
    car: [4, 1.5, 2],
    truck: [5, 2, 2.5],
    helicopter: [5, 2, 3],
    plane: [8, 2, 2],
    boat: [6, 1.5, 2.5],
  };

  const dim = dims[vehicle.type];

  return (
    <group
      position={vehicle.position}
      onClick={onEnter}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={dim} />
        <meshLambertMaterial color={vehicle.color} />
      </mesh>
      {/* Cabin/roof */}
      {(vehicle.type === 'car' || vehicle.type === 'truck') && (
        <mesh position={[0, dim[1] * 0.75, 0]}>
          <boxGeometry args={[dim[0] * 0.6, dim[1] * 0.6, dim[2] * 0.9]} />
          <meshLambertMaterial color={vehicle.color} />
        </mesh>
      )}
      {/* Wheels */}
      {(vehicle.type === 'car' || vehicle.type === 'truck') &&
        [[-dim[0] * 0.35, -dim[1] * 0.5, -dim[2] * 0.55],
         [dim[0] * 0.35, -dim[1] * 0.5, -dim[2] * 0.55],
         [-dim[0] * 0.35, -dim[1] * 0.5, dim[2] * 0.55],
         [dim[0] * 0.35, -dim[1] * 0.5, dim[2] * 0.55]].map((wp, i) => (
          <mesh key={i} position={wp as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 8]} />
            <meshLambertMaterial color="#222222" />
          </mesh>
        ))}
      {/* Helicopter rotor */}
      {vehicle.type === 'helicopter' && (
        <mesh position={[0, dim[1], 0]} rotation={[0, Date.now() * 0.01, 0]}>
          <boxGeometry args={[6, 0.1, 0.3]} />
          <meshLambertMaterial color="#888888" />
        </mesh>
      )}
      {/* Wings for plane */}
      {vehicle.type === 'plane' && (
        <>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.1, 12]} />
            <meshLambertMaterial color={vehicle.color} />
          </mesh>
          <mesh position={[dim[0] * 0.4, 0, -dim[2] * 0.5]}>
            <boxGeometry args={[0.3, 0.1, 4]} />
            <meshLambertMaterial color={vehicle.color} />
          </mesh>
        </>
      )}
      {/* Hover label */}
      {hovered && (
        <Text
          position={[0, dim[1] + 1.5, 0]}
          fontSize={0.6}
          color="#ff6600"
          anchorX="center"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {vehicle.label} [Click to Enter]
        </Text>
      )}
      {/* Glow when hovered */}
      {hovered && (
        <pointLight position={[0, 1, 0]} intensity={1} color="#ff6600" distance={6} />
      )}
    </group>
  );
}

export default function VehicleManager({ playerPos, onInteract }: VehicleManagerProps) {
  const handleEnterVehicle = (vehicle: VehicleData) => {
    onInteract(`Entered ${vehicle.label}! Use WASD to drive.`);
  };

  return (
    <group>
      {PARKED_VEHICLES.map((v) => (
        <VehicleMesh key={v.id} vehicle={v} onEnter={() => handleEnterVehicle(v)} />
      ))}
    </group>
  );
}
