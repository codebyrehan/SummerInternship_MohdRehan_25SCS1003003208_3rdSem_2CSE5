import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SectionHeading, Card } from '../ui/PremiumUI';

function Mini3DIcon({ type, isHovered }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    const rotSpeed = isHovered ? 2.5 : 0.5;
    meshRef.current.rotation.y += delta * rotSpeed;
    meshRef.current.rotation.x += delta * rotSpeed * 0.5;
  });

  const getGeometry = () => {
    switch(type) {
      case 'doc': return <planeGeometry args={[1.2, 1.6]} />;
      case 'globe': return <sphereGeometry args={[0.9, 16, 16]} />;
      case 'icosahedron': return <icosahedronGeometry args={[0.9, 0]} />;
      case 'torus': return (
        <group>
          <mesh rotation={[Math.PI/2, 0, 0]}><torusGeometry args={[0.6, 0.2, 16, 32]} /></mesh>
          <mesh rotation={[0, Math.PI/2, 0]}><torusGeometry args={[0.6, 0.2, 16, 32]} /></mesh>
        </group>
      );
      case 'score': return <torusGeometry args={[0.8, 0.25, 16, 50]} />;
      case 'box': return <boxGeometry args={[1.2, 1.2, 1.2]} />;
      case 'pill': return <capsuleGeometry args={[0.4, 0.8, 4, 16]} />;
      case 'arrow': return <coneGeometry args={[0.6, 1.5, 3]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef}>
      {getGeometry()}
      <meshStandardMaterial 
        color={type === 'torus' || type === 'globe' ? "#06b6d4" : "#6366f1"} 
        wireframe={type === 'globe'}
        metalness={0.4}
        roughness={0.2}
      />
    </mesh>
  );
}

const features = [
  { id: 'doc', title: 'ATS Resume Builder', desc: 'Craft optimized resumes that sail through screening systems easily.' },
  { id: 'globe', title: 'Portfolio Generator', desc: 'Turn your resume into a stunning hosted 1-page web portfolio.' },
  { id: 'icosahedron', title: 'AI Bullet Enhancer', desc: 'Rewrite weak work experience into strong impact-driven statements.' },
  { id: 'torus', title: 'Job Matcher', desc: 'Match your resume to specific Job Descriptions instantly.' },
  { id: 'score', title: 'Resume Checker', desc: 'Get an actionable score and improvement tips for your resume.' },
  { id: 'box', title: 'Cover Letters', desc: 'Generate personalized cover letters tailored to each job.' },
  { id: 'pill', title: 'LinkedIn Bio Gen', desc: 'Optimize your LinkedIn headline and About section with AI.' },
  { id: 'arrow', title: '1-Click Export', desc: 'Download pixel-perfect, highly formatted PDFs reliably.' }
];

export default function FeaturesSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  return (
    <section id="features" className="section-padding bg-surface">
      <SectionHeading 
        badge="EVERYTHING YOU NEED"
        title={<span>Powerful Tools. <br className="md:hidden" />Zero Complexity.</span>}
      />
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`flex flex-col items-center text-center transition-colors duration-300 ${isHovered ? 'border-primary/50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-20 h-20 mb-6 drop-shadow-xl relative flex justify-center items-center bg-background/50 rounded-2xl border border-white/5">
        {!isMobile ? (
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }} dpr={[1, 2]}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[2, 2, 2]} intensity={1.5} />
              <Mini3DIcon type={feature.id} isHovered={isHovered} />
            </Canvas>
          </Suspense>
        ) : (
          <div className="text-secondary font-bold text-2xl">{feature.title[0]}</div>
        )}
      </div>
      <h3 className="text-lg font-sora font-bold text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
    </Card>
  );
}
