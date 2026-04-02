import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Badge, Button } from '../ui/PremiumUI';

function Hero3DScene() {
  const groupRef = useRef();
  const lineRef1 = useRef();
  const lineRef2 = useRef();

  // Mouse Parallax + floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const targetX = (state.mouse.x * Math.PI) / 15;
    const targetY = (state.mouse.y * Math.PI) / 15;

    if (groupRef.current) {
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Resume Card — dark premium glass look */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <group position={[0, 0, 0.3]}>
          {/* Card body - dark */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.6, 3.6, 0.08]} />
            <meshStandardMaterial color="#0d0e1f" metalness={0.6} roughness={0.2} />
          </mesh>
          {/* Glowing indigo border frame */}
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[2.62, 3.62, 0.01]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.8} wireframe />
          </mesh>
          {/* Resume header line - cyan */}
          <mesh position={[0, 1.3, 0.06]}>
            <boxGeometry args={[1.8, 0.06, 0.01]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} />
          </mesh>
          {/* Resume content lines */}
          {[-0.2, -0.5, -0.8, -1.1].map((y, i) => (
            <mesh key={i} position={[i % 2 === 0 ? -0.2 : 0.1, y, 0.06]}>
              <boxGeometry args={[i % 2 === 0 ? 1.4 : 1.0, 0.04, 0.01]} />
              <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Abstract Glowing Sphere Behind */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial
          color="#6366f1"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.7}
          roughness={0.2}
          distort={0.3}
          speed={1.5}
        />
      </mesh>

      {/* Orbiting Particles */}
      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[2, 1.5, 1]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.5} roughness={0.1} wireframe />
        </mesh>
        <mesh position={[-2, -1, 1.5]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.1} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroSection() {

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_10%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          <Badge className="mb-6">
            <span className="text-primary">✦</span> AI-Powered Career Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-sora font-extrabold leading-tight mb-6">
            Build a Resume <br />
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              Actually Notice
            </span>
          </h1>
          
          <p className="text-text-muted text-lg md:text-xl font-inter font-light max-w-lg mb-10 leading-relaxed">
            Create ATS-friendly resumes, premium portfolios, and personalized career assets with AI-powered precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button className="!px-8 !py-4 text-base">Build My Resume &rarr;</Button>
            <Button variant="ghost" className="!px-8 !py-4 text-base">Explore Templates</Button>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-card overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-text-muted text-sm font-medium">Trusted by <span className="text-white font-bold">10,000+</span> job seekers</p>
          </div>
        </motion.div>

        {/* Right 3D Scene */}
        <div className="h-[500px] lg:h-[700px] w-full relative">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
              <pointLight position={[-3, 2, 2]} intensity={2} color="#06b6d4" />
              <Hero3DScene />
              <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={15} blur={2.5} far={4.5} color="#6366f1" />
              <Environment preset="city" />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
