'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveParticles({ count = 2000 }) {
  const { mouse, viewport } = useThree();
  const mesh = useRef<THREE.Points>(null!);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      particle.mx += (mouse.x * viewport.width - particle.mx) * 0.01;
      particle.my += (mouse.y * viewport.height - particle.my) * 0.01;
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * s + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
    });
  });

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, [count]);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#6366f1"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 2, camera.position.z), 0.02);
    camera.lookAt(0, 0, 0);
  });
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={75} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <InteractiveParticles count={1500} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Sphere args={[2, 64, 64]} position={[0, 0, -10]}>
            <MeshDistortMaterial
              color="#4f46e5"
              speed={2}
              distort={0.4}
              radius={1}
              emissive="#000000"
              transparent
              opacity={0.05}
            />
          </Sphere>
        </Float>
        <Rig />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
      <div className="absolute inset-0 vignette pointer-events-none" />
    </div>
  );
}
