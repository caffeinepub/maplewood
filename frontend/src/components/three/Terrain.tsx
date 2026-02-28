import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function generateHeightmap(width: number, depth: number): Float32Array {
  const data = new Float32Array(width * depth);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      const x = i / width;
      const z = j / depth;

      // Mountains in corners/edges
      const mountainNW = Math.max(0, 1 - Math.sqrt((x * 2) ** 2 + (z * 2) ** 2)) * 60;
      const mountainNE = Math.max(0, 1 - Math.sqrt(((x - 1) * 2) ** 2 + (z * 2) ** 2)) * 50;

      // City area (center) - flat
      const cityDist = Math.sqrt((x - 0.5) ** 2 + (z - 0.5) ** 2);
      const cityFlat = Math.max(0, 1 - cityDist * 3) * -5;

      // Rolling hills
      const hills = Math.sin(x * 8) * Math.cos(z * 6) * 5 + Math.sin(x * 15 + 1) * Math.cos(z * 12) * 2;

      // River valley
      const riverX = Math.abs(x - 0.3) < 0.05 ? -8 : 0;

      const height = Math.max(0, mountainNW + mountainNE + hills + cityFlat + riverX);
      data[i * depth + j] = height;
    }
  }
  return data;
}

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const size = 1000;
    const segments = 128;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const heights = generateHeightmap(segments + 1, segments + 1);
    const positions = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
      positions.setY(i, heights[i] || 0);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  const terrainMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      vertexColors: false,
      color: new THREE.Color(0x4a7c3f),
      side: THREE.FrontSide,
    });
  }, []);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      (waterRef.current.material as THREE.MeshLambertMaterial).opacity =
        0.7 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group>
      {/* Main terrain */}
      <mesh ref={meshRef} geometry={geometry} material={terrainMaterial} receiveShadow />

      {/* Water plane */}
      <mesh ref={waterRef} position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshLambertMaterial color={0x1a6b9a} transparent opacity={0.75} />
      </mesh>

      {/* Ground patches for city area */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshLambertMaterial color={0x888888} />
      </mesh>

      {/* Snow on mountains */}
      <mesh position={[-300, 45, -300]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>
    </group>
  );
}
