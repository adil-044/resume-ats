'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function PaperResume({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 0.35 + position[0]) * 0.04;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[2.2, 2.9, 0.04]} />
        <meshStandardMaterial
          color="#EDE6D9"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      {/* Ink lines suggestion */}
      <mesh position={[position[0], position[1] + 0.7, position[2] + 0.03]} rotation={rotation} scale={scale}>
        <planeGeometry args={[1.4, 0.08]} />
        <meshBasicMaterial color="#1A1814" transparent opacity={0.35} />
      </mesh>
      <mesh position={[position[0], position[1] + 0.35, position[2] + 0.03]} rotation={rotation} scale={scale}>
        <planeGeometry args={[1.6, 0.04]} />
        <meshBasicMaterial color="#1A1814" transparent opacity={0.2} />
      </mesh>
      <mesh position={[position[0], position[1] + 0.15, position[2] + 0.03]} rotation={rotation} scale={scale}>
        <planeGeometry args={[1.5, 0.04]} />
        <meshBasicMaterial color="#1A1814" transparent opacity={0.18} />
      </mesh>
    </Float>
  );
}

function SoftFog() {
  return (
    <mesh position={[0, -3.5, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial color="#0C0C0B" transparent opacity={0.9} />
    </mesh>
  );
}

function Dust({ count = 80 }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 18;
      p[i * 3 + 1] = (Math.random() - 0.5) * 12;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#C4A574" transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

function Rig({ enabled }: { enabled: boolean }) {
  const { camera, mouse } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);
  return useFrame(() => {
    if (!enabled) return;
    camera.position.lerp(vec.set(mouse.x * 1.2, mouse.y * 0.6, 8), 0.025);
    camera.lookAt(0, 0, 0);
  });
}

function Scene({ animate }: { animate: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#EDE6D9" />
      <pointLight position={[-4, 2, 4]} intensity={0.7} color="#C4A574" />
      <pointLight position={[3, -2, 2]} intensity={0.25} color="#8A9A8E" />

      <PaperResume position={[-2.2, 0.3, 0]} rotation={[0.15, 0.35, -0.12]} scale={1} />
      <PaperResume position={[0.3, -0.2, -1]} rotation={[-0.1, -0.25, 0.08]} scale={0.95} />
      <PaperResume position={[2.4, 0.5, -0.4]} rotation={[0.2, -0.4, 0.1]} scale={0.85} />

      <Dust count={animate ? 80 : 40} />
      <SoftFog />
      <Rig enabled={animate} />
    </>
  );
}

export default function HeroCanvas() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = !reduceMotion && visible;

  return (
    <div ref={wrap} className="absolute inset-0 -z-10 bg-[#0C0C0B]" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={animate ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#0C0C0B']} />
        <Scene animate={animate} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0B]/40 via-transparent to-[#0C0C0B] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0B]/70 via-transparent to-[#0C0C0B]/50 pointer-events-none" />
    </div>
  );
}
