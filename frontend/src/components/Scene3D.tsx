'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

function BackgroundElements() {
  const points = useMemo(() => {
    const p = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
            args={[points, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.015} color="#6366f1" transparent opacity={0.2} sizeAttenuation />
      </points>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]} position={[4, 2, -5]}>
          <MeshDistortMaterial
            color="#4f46e5"
            speed={2}
            distort={0.5}
            radius={1}
            emissive="#4338ca"
            emissiveIntensity={0.2}
            transparent
            opacity={0.1}
          />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.8, 64, 64]} position={[-5, -2, -3]}>
          <MeshDistortMaterial
            color="#06b6d4"
            speed={4}
            distort={0.3}
            radius={1}
            transparent
            opacity={0.05}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <BackgroundElements />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
    </div>
  );
}
