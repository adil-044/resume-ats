'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function CoreGeometry() {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {/* Central Identity Sphere */}
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Icosahedron args={[1, 15]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#6366f1"
            speed={2}
            distort={0.3}
            radius={1}
            emissive="#4f46e5"
            emissiveIntensity={0.5}
          />
        </Icosahedron>
      </Float>

      {/* Orbiting Signal Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.01, 16, 100]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
      
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.005, 16, 100]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function NexusCore() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <CoreGeometry />
      </Canvas>
    </div>
  );
}
