import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const ProceduralRocket: React.FC = () => {
  const flameRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (flameRef.current) {
      // Animate flame scaling to simulate thrust
      flameRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 20) * 0.2;
      flameRef.current.scale.x = 1 + Math.sin(clock.elapsedTime * 30) * 0.1;
      flameRef.current.scale.z = 1 + Math.sin(clock.elapsedTime * 30) * 0.1;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* Main Body */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#ff4444" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Fins */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rotation, i) => (
        <group key={i} rotation={[0, rotation, 0]}>
          <mesh position={[0.6, 0.5, 0]} castShadow receiveShadow>
            {/* Using a custom shape for aerodynamics */}
            <boxGeometry args={[0.8, 1.2, 0.1]} />
            <meshStandardMaterial color="#ff4444" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Window */}
      <group position={[0, 1.8, 0.48]} rotation={[0, 0, 0]}>
        {/* Frame */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.05, 16, 32]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Glass */}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshPhysicalMaterial 
            color="#44aaff" 
            transmission={0.9} 
            opacity={1} 
            metalness={0.1} 
            roughness={0} 
            ior={1.5} 
            thickness={0.5} 
          />
        </mesh>
      </group>

      {/* Engine Nozzle */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.5, 32]} />
        <meshStandardMaterial color="#333333" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Exhaust Flame */}
      <mesh ref={flameRef} position={[0, -0.4, 0]}>
        <coneGeometry args={[0.25, 1, 16]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff5500" 
          emissiveIntensity={4} 
          toneMapped={false} 
        />
        {/* Inner flame core for realistic effect */}
        <mesh position={[0, -0.1, 0]}>
          <coneGeometry args={[0.15, 0.7, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={6} 
            toneMapped={false} 
          />
        </mesh>
      </mesh>
    </group>
  );
};

export default ProceduralRocket;
