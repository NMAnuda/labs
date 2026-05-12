import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GlowingPath = () => {
  const pathRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Define a curving 3D spline path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 3, 0),
      new THREE.Vector3(-1, 2, -2),
      new THREE.Vector3(2, 0.5, -1),
      new THREE.Vector3(0, -1, 1),
      new THREE.Vector3(-2, -3, -1),
      new THREE.Vector3(1, -5, 0),
      new THREE.Vector3(3, -8, -2),
      new THREE.Vector3(0, -10, 1),
      new THREE.Vector3(-3, -14, -1),
      new THREE.Vector3(0, -18, 0),
    ], false, 'catmullrom', 0.5);
  }, []);

  // Generate tube geometry from the curve
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 200, 0.04, 8, false);
  }, [curve]);

  // Outer glow tube
  const glowTubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 200, 0.12, 8, false);
  }, [curve]);

  // Particles along the path
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 300;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const point = curve.getPointAt(t);
      // Slight random offset from the path
      positions[i * 3] = point.x + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 1.5;
      sizes[i] = Math.random() * 0.05 + 0.01;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [curve]);

  // Animate particles twinkling
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.4 + Math.sin(clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group ref={pathRef}>
      {/* Core bright path line */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#8fb4e4"
          emissive="#7da7dc"
          emissiveIntensity={1.5}
          toneMapped={false}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* Outer glow layer */}
      <mesh ref={glowRef} geometry={glowTubeGeometry}>
        <meshStandardMaterial
          color="#6e89b4"
          emissive="#5f7fa8"
          emissiveIntensity={0.7}
          toneMapped={false}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating data particles along path */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          color="#9ebfe6"
          size={0.028}
          transparent
          opacity={0.36}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

// Helper: get the curve used in GlowingPath so Scene can position the astronaut+rocket on it
export const getPathCurve = () => {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 3, 0),
    new THREE.Vector3(-1, 2, -2),
    new THREE.Vector3(2, 0.5, -1),
    new THREE.Vector3(0, -1, 1),
    new THREE.Vector3(-2, -3, -1),
    new THREE.Vector3(1, -5, 0),
    new THREE.Vector3(3, -8, -2),
    new THREE.Vector3(0, -10, 1),
    new THREE.Vector3(-3, -14, -1),
    new THREE.Vector3(0, -18, 0),
  ], false, 'catmullrom', 0.5);
};

export default GlowingPath;
