import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingPlanets: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.y += 0.002 * (i % 2 === 0 ? 1 : -1);
        child.position.y += Math.sin(clock.elapsedTime * 0.5 + i) * 0.001;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Saturn-like planet */}
      <group position={[6, 4, -10]}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#9b6dff"
            roughness={0.6}
            metalness={0.2}
            emissive="#4a2d8a"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Ring */}
        <mesh rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[1.3, 0.08, 8, 64]} />
          <meshStandardMaterial
            color="#c9a0ff"
            emissive="#8855cc"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Small blue planet */}
      <group position={[-5, -2, -8]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#3388ff"
            roughness={0.5}
            metalness={0.3}
            emissive="#1155aa"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* Distant orange planet */}
      <group position={[8, -8, -15]}>
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial
            color="#ff6633"
            roughness={0.7}
            metalness={0.1}
            emissive="#993311"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Small green moon */}
      <group position={[-7, 6, -12]}>
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color="#44ff88"
            roughness={0.4}
            metalness={0.3}
            emissive="#22aa44"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Nebula cloud effect - large transparent sphere */}
      <mesh position={[0, -5, -20]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshStandardMaterial
          color="#1a0044"
          emissive="#220066"
          emissiveIntensity={0.2}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Another nebula */}
      <mesh position={[5, 5, -18]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial
          color="#001133"
          emissive="#003366"
          emissiveIntensity={0.1}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default FloatingPlanets;
