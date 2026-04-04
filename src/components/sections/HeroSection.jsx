import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, ContactShadows, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Badge, Button } from '../ui/PremiumUI';

function Hero3DScene() {
  const groupRef = useRef();

  // Mouse Parallax + floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const targetX = (state.mouse.x * Math.PI) / 10;
    const targetY = (state.mouse.y * Math.PI) / 10;

    if (groupRef.current) {
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Background Cosmic Field */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={50} scale={10} size={1} speed={0.4} color="#6366f1" />
      <Sparkles count={30} scale={10} size={1.5} speed={0.6} color="#06b6d4" />

      {/* Main Career Galaxy Nebula (Central Glow) */}
      <mesh position={[0, 0, -2]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <MeshDistortMaterial
          color="#1e224f"
          emissive="#6366f1"
          emissiveIntensity={0.5}
          distort={0.6}
          speed={2}
          roughness={0}
        />
      </mesh>

      {/* Floating Resume Card — dark premium glass look */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[0, 0, 1]}>
          {/* Card body - dark metallic glass */}
          <mesh castShadow>
            <boxGeometry args={[2.8, 3.8, 0.1]} />
            <meshStandardMaterial 
              color="#05060f" 
              metalness={0.9} 
              roughness={0.1} 
              transparent 
              opacity={0.9} 
            />
          </mesh>
          
          {/* Neon Border */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[2.82, 3.82, 0.01]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={2} wireframe />
          </mesh>

          {/* AI Signature Node (Small Glowing Cube) */}
          <mesh position={[0, 1.4, 0.08]}>
            <boxGeometry args={[1.5, 0.1, 0.01]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} />
          </mesh>

          {/* Content Lines (Glow) */}
          {[-0.2, -0.6, -1.0, -1.4].map((y, i) => (
            <mesh key={i} position={[i % 2 === 0 ? -0.4 : 0.2, y, 0.08]}>
              <boxGeometry args={[i % 2 === 0 ? 1.6 : 1.2, 0.05, 0.01]} />
              <meshStandardMaterial 
                color="#6366f1" 
                emissive="#6366f1" 
                emissiveIntensity={1.5} 
                transparent 
                opacity={0.7} 
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Orbiting Career Nodes */}
      {[...Array(4)].map((_, i) => (
        <Float key={i} speed={2 + i} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[
            Math.cos(i * Math.PI / 2) * 4, 
            Math.sin(i * Math.PI / 2) * 3, 
            -1
          ]}>
            <icosahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#6366f1" : "#06b6d4"} 
              emissive={i % 2 === 0 ? "#6366f1" : "#06b6d4"}
              emissiveIntensity={2}
              wireframe 
            />
          </mesh>
        </Float>
      ))}
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
