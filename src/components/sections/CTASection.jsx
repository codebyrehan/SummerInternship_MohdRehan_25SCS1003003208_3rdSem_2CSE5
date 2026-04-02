import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { Button } from '../ui/PremiumUI';
import { motion } from 'framer-motion';

function BlobBg() {
  return (
    <mesh>
      <sphereGeometry args={[2.5, 32, 32]} />
      <MeshDistortMaterial
        color="#6366f1"
        envMapIntensity={0.5}
        clearcoat={0.5}
        metalness={0.1}
        roughness={0.5}
        distort={0.4}
        speed={1.2}
      />
    </mesh>
  );
}

export default function CTASection() {

  return (
    <section className="relative py-[140px] overflow-hidden bg-surface flex flex-col items-center justify-center text-center px-6">
      {/* 3D Blob background */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[3, 3, 3]} intensity={2} color="#06b6d4" />
            <BlobBg />
          </Canvas>
        </Suspense>
      </div>

      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)] z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <h2 className="text-5xl md:text-7xl font-sora font-extrabold mb-6 leading-tight text-white">
          Your Dream Job Is<br />
          <span className="text-transparent bg-clip-text bg-gradient-primary">One Resume Away</span>
        </h2>

        <p className="text-text-muted text-xl mb-12">
          Join 10,000+ professionals who built their career with QuickHire AI
        </p>

        <Link to="/build">
          <Button className="!px-12 !py-5 text-xl !rounded-2xl shadow-glow-primary-hover">
            Start Building Free &rarr;
          </Button>
        </Link>

        <p className="text-text-muted text-sm mt-8">
          No credit card required &nbsp;·&nbsp; Free forever plan &nbsp;·&nbsp; Export unlimited
        </p>
      </motion.div>
    </section>
  );
}
