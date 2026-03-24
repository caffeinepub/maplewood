import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function generateHeightmap(width: number, depth: number): Float32Array {
  const data = new Float32Array(width * depth);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < depth; j++) {
      const x = i / width;
      const z = j / depth;
      const mountainNW =
        Math.max(0, 1 - Math.sqrt((x * 2) ** 2 + (z * 2) ** 2)) * 60;
      const mountainNE =
        Math.max(0, 1 - Math.sqrt(((x - 1) * 2) ** 2 + (z * 2) ** 2)) * 50;
      const cityDist = Math.sqrt((x - 0.5) ** 2 + (z - 0.5) ** 2);
      const cityFlat = Math.max(0, 1 - cityDist * 3) * -5;
      const hills =
        Math.sin(x * 8) * Math.cos(z * 6) * 5 +
        Math.sin(x * 15 + 1) * Math.cos(z * 12) * 2;
      const riverX = Math.abs(x - 0.3) < 0.05 ? -8 : 0;
      const height = Math.max(
        0,
        mountainNW + mountainNE + hills + cityFlat + riverX,
      );
      data[i * depth + j] = height;
    }
  }
  return data;
}

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const waterTimeRef = useRef(0);

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

  // Grass texture from Poly Haven CDN
  const grassTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop",
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(40, 40);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const _grassNormalTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop",
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(40, 40);
    return tex;
  }, []);

  const terrainMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: grassTexture,
      roughness: 0.9,
      metalness: 0.0,
      color: new THREE.Color(0x7ab648),
    });
  }, [grassTexture]);

  // Asphalt texture for city ground
  const asphaltTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=512&h=512&fit=crop",
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 20);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Water normal map for animation
  const waterNormalTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=512&h=512&fit=crop",
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }, []);

  const waterMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1a6b9a),
      normalMap: waterNormalTexture,
      normalScale: new THREE.Vector2(0.3, 0.3),
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.82,
    });
  }, [waterNormalTexture]);

  const snowTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=512&h=512&fit=crop",
    );
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    waterTimeRef.current = clock.getElapsedTime();
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      mat.normalMap!.offset.set(
        Math.sin(waterTimeRef.current * 0.1) * 0.1,
        waterTimeRef.current * 0.05,
      );
      mat.opacity = 0.78 + Math.sin(waterTimeRef.current * 0.5) * 0.04;
    }
  });

  return (
    <group>
      {/* Main terrain with grass texture */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={terrainMaterial}
        receiveShadow
        castShadow
      />

      {/* Animated water plane */}
      <mesh
        ref={waterRef}
        position={[0, 0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>

      {/* City asphalt ground */}
      <mesh
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          map={asphaltTexture}
          roughness={0.95}
          metalness={0.0}
          color={0x888888}
        />
      </mesh>

      {/* Snow on mountains */}
      <mesh
        position={[-300, 45, -300]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial
          map={snowTexture}
          roughness={0.7}
          metalness={0.0}
          color={0xeef5ff}
        />
      </mesh>
    </group>
  );
}
