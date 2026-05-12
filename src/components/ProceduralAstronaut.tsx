import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ProceduralAstronaut: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);

  // Visor glow animation
  useFrame(({ clock }) => {
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * 2) * 0.3;
    }
  });

  const suitColor = '#e8e8e8';
  const accentColor = '#1a9fff';
  const darkColor = '#2a2a2a';

  return (
    <group ref={groupRef}>
      {/* ===== HELMET ===== */}
      <group position={[0, 1.65, 0]}>
        {/* Outer Helmet Shell */}
        <mesh castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color={suitColor} roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Visor (front-facing glowing cyan) */}
        <mesh ref={visorRef} position={[0, 0, 0.22]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.28, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={1}
            transmission={0.6}
            opacity={0.9}
            transparent
            metalness={0.3}
            roughness={0}
            ior={1.8}
          />
        </mesh>
        {/* Visor frame ring */}
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.025, 16, 32]} />
          <meshStandardMaterial color={darkColor} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0.2, 0.3, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
          <meshStandardMaterial color={darkColor} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0.42, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#ff3333"
            emissive="#ff3333"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ===== TORSO ===== */}
      <group position={[0, 0.9, 0]}>
        {/* Main torso */}
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 0.5, 16, 32]} />
          <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Chest panel */}
        <mesh position={[0, 0.05, 0.28]}>
          <boxGeometry args={[0.25, 0.2, 0.05]} />
          <meshStandardMaterial color={darkColor} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Chest panel lights */}
        {[-0.06, 0, 0.06].map((x, i) => (
          <mesh key={i} position={[x, 0.1, 0.31]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial
              color={i === 1 ? '#00ff88' : accentColor}
              emissive={i === 1 ? '#00ff88' : accentColor}
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        ))}
        {/* Backpack */}
        <mesh position={[0, 0, -0.35]} castShadow>
          <boxGeometry args={[0.4, 0.55, 0.2]} />
          <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Backpack vents */}
        {[-0.1, 0.1].map((x, i) => (
          <mesh key={i} position={[x, -0.15, -0.46]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 8]} />
            <meshStandardMaterial color={darkColor} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Backpack glow accent */}
        <mesh position={[0, 0.15, -0.46]}>
          <boxGeometry args={[0.3, 0.04, 0.02]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ===== ARMS ===== */}
      {/* Left Arm */}
      <group position={[-0.45, 1.0, 0]} rotation={[0.3, 0, 0.4]}>
        {/* Upper arm */}
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Shoulder ring */}
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.11, 0.02, 8, 16]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1} />
        </mesh>
        {/* Forearm */}
        <group position={[0, -0.4, 0.1]} rotation={[-0.5, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
            <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Glove */}
          <mesh position={[0, -0.2, 0]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={darkColor} roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group position={[0.45, 1.0, 0]} rotation={[-0.2, 0, -0.3]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
          <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.11, 0.02, 8, 16]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1} />
        </mesh>
        <group position={[0, -0.4, -0.05]} rotation={[0.3, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
            <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={darkColor} roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ===== LEGS ===== */}
      {/* Left Leg */}
      <group position={[-0.15, 0.15, 0]} rotation={[0.6, 0, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
          <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Knee joint */}
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Lower leg */}
        <group position={[0, -0.45, 0.15]} rotation={[-0.8, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
            <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Boot */}
          <mesh position={[0, -0.25, 0.05]} castShadow>
            <boxGeometry args={[0.14, 0.1, 0.22]} />
            <meshStandardMaterial color={darkColor} roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[0.15, 0.15, 0]} rotation={[-0.3, 0, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
          <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={darkColor} roughness={0.5} metalness={0.6} />
        </mesh>
        <group position={[0, -0.45, -0.1]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.1, 0.3, 8, 16]} />
            <meshStandardMaterial color={suitColor} roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.25, 0.05]} castShadow>
            <boxGeometry args={[0.14, 0.1, 0.22]} />
            <meshStandardMaterial color={darkColor} roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default ProceduralAstronaut;
