import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, MeshDistortMaterial, PresentationControls, Environment } from '@react-three/drei';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Layers, Zap, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// 3D Objects
function HeroShape() {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.005;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t / 4) / 4;
    meshRef.current.rotation.z = Math.sin(t / 4) / 4;
    // Mouse Parallax
    const mouseX = (state.mouse.x * Math.PI) / 10;
    const mouseY = (state.mouse.y * Math.PI) / 10;
    meshRef.current.rotation.y += (mouseX - meshRef.current.rotation.y) * 0.1;
    meshRef.current.rotation.x += (-mouseY - meshRef.current.rotation.x) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} scale={[1, 1, 1]} castShadow>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#6c63ff" metalness={0.2} roughness={0.3} wireframe />
      </mesh>
      <mesh ref={meshRef} scale={[0.8, 0.8, 0.8]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#00d4aa" metalness={0.5} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function FeatureIcon({ geometry, color, isHovered }) {
  const meshRef = useRef();
  
  useFrame(() => {
    meshRef.current.rotation.y += isHovered ? 0.05 : 0.01;
    meshRef.current.rotation.x += isHovered ? 0.05 : 0.01;
  });

  return (
    <mesh ref={meshRef} scale={1.5}>
      {geometry === 'torus' && <torusGeometry args={[1, 0.4, 16, 100]} />}
      {geometry === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
      {geometry === 'cube' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} />
    </mesh>
  );
}

function BlobShape() {
  return (
    <mesh scale={1.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#6c63ff"
        envMapIntensity={0.4}
        clearcoat={0.8}
        clearcoatRoughness={0}
        metalness={0.2}
        roughness={0.3}
        distort={0.4}
        speed={2}
      />
    </mesh>
  );
}

function DemoLaptop() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.1 - 0.2;
    meshRef.current.rotation.x = 0.1;
  });
  
  return (
    <PresentationControls global rotation={[0.1, -0.2, 0]} polar={[-0.4, 0.2]} azimuth={[-1, 0.75]} config={{ mass: 2, tension: 400 }}>
      <Float rotationIntensity={0.4}>
        <mesh ref={meshRef}>
          <boxGeometry args={[4, 2.5, 0.1]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.8} roughness={0.2} />
          {/* Faux Screen */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.8, 2.3]} />
            <meshBasicMaterial color="#f5f5ff" />
          </mesh>
        </mesh>
      </Float>
    </PresentationControls>
  );
}

function FeatureCard({ feature, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-48 mb-6 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 2]} />
          <Suspense fallback={null}>
            <FeatureIcon geometry={feature.icon} color={feature.color} isHovered={isHovered} />
          </Suspense>
        </Canvas>
      </div>
      <h3 className="text-2xl mb-3">{feature.title}</h3>
      <p className="text-body leading-relaxed">{feature.desc}</p>
    </div>
  );
}

export default function Landing() {
  const [isMobile, setIsMobile] = useState(false);
  const heroObjRef = useRef(null);
  const demoRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Hero object spring scaling
    if (heroObjRef.current) {
      gsap.fromTo(heroObjRef.current, { scale: 0 }, { scale: 1, duration: 1.5, ease: 'back.out(1.7)' });
    }

    // Stats count up
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        onEnter: () => {
          const target = parseInt(el.getAttribute('data-target'));
          gsap.fromTo(el, { innerHTML: 0 }, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out',
            onUpdate: function() {
              el.innerHTML = Math.round(this.targets()[0].innerHTML) + (el.getAttribute('data-suffix') || '');
            }
          });
        }
      });
    });

    // Demo section scroll animation
    if (demoRef.current) {
      gsap.fromTo('.demo-3d', 
        { x: 300, opacity: 0 }, 
        { 
          x: 0, opacity: 1, 
          scrollTrigger: {
            trigger: demoRef.current,
            start: "top 60%",
            end: "top 20%",
            scrub: 1
          }
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-dark">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md">
        <h1 className="text-2xl text-primary flex items-center gap-2">
          <Zap size={28} /> Quick Hire AI
        </h1>
        <div className="flex gap-4">
          <Link to="/build" className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            Build Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden pt-20 radial-gradient-bg px-6">
        <div className="z-10 md:w-1/2 flex flex-col items-start gap-6 md:pl-20">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Build Your Resume. <br />
            Launch Your <span className="text-primary">Career.</span>
          </h1>
          <p className="text-xl text-body max-w-lg">
            AI-powered resume builder with instant portfolio generation. Get hired faster with our smart tools.
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/build" className="px-8 py-4 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/30">
              Build My Resume
            </Link>
            <Link to="/portfolio/demo" className="px-8 py-4 rounded-lg font-bold text-primary border-2 border-primary hover:bg-primary/10 transition-all">
              See Example
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 h-[50vh] md:h-full relative w-full" ref={heroObjRef}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <Suspense fallback={null}>
              <HeroShape />
              <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2} far={4} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-light" id="features">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl">Everything you need to <span className="text-secondary">stand out</span></h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { id: 1, title: 'AI-Powered Writing', desc: 'Let AI craft the perfect bullet points and summaries based on your raw input.', icon: 'torus', color: '#6c63ff' },
            { id: 2, title: 'Multiple Templates', desc: 'Choose from Classic, Modern, or Minimal ATS-friendly layouts.', icon: 'icosahedron', color: '#00d4aa' },
            { id: 3, title: 'Instant Portfolio', desc: 'Automatically generate a stunning 1-page web portfolio from your resume data.', icon: 'cube', color: '#333333' }
          ].map((feature) => (
            <FeatureCard key={feature.id} feature={feature} isMobile={isMobile} />
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section ref={demoRef} className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
          <div className="md:w-1/2 flex flex-col gap-8">
            <h2 className="text-4xl md:text-5xl leading-tight">
              Create once. <br/> Deploy everywhere.
            </h2>
            <ul className="space-y-6">
              {['ATS-Friendly PDF Export', 'Unique shareable portfolio link', 'Real-time live preview editing', 'Privacy-first localStorage save'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-xl font-medium text-dark">
                  <CheckCircle2 className="text-secondary" size={28} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 h-[50vh] w-full demo-3d">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <Suspense fallback={null}>
                <DemoLaptop />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-dark text-white border-y border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-700">
          <div>
            <div className="text-5xl font-syne font-bold text-secondary stat-number" data-target="10000" data-suffix="+">0</div>
            <p className="text-gray-400 mt-2 font-medium">Resumes Built</p>
          </div>
          <div>
            <div className="text-5xl font-syne font-bold text-primary stat-number" data-target="500" data-suffix="+">0</div>
            <p className="text-gray-400 mt-2 font-medium">Hired Users</p>
          </div>
          <div>
            <div className="text-5xl font-syne font-bold text-white stat-number" data-target="3">0</div>
            <p className="text-gray-400 mt-2 font-medium">Pro Templates</p>
          </div>
          <div>
            <div className="text-5xl font-syne font-bold text-white">AI</div>
            <p className="text-gray-400 mt-2 font-medium">Powered Writer</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-32 px-6 bg-light relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 1.5]}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} />
            <Suspense fallback={null}>
              <BlobShape />
            </Suspense>
          </Canvas>
        </div>
        <div className="z-10 relative">
          <h2 className="text-5xl font-syne md:text-7xl mb-8 font-black text-dark">Ready to land your <br/> dream job?</h2>
          <Link to="/build" className="px-10 py-5 rounded-xl font-bold text-xl text-white bg-dark hover:scale-105 transition-transform shadow-2xl inline-flex items-center gap-3">
            Start Building Free <Zap fill="currentColor" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <p className="font-syne font-bold text-xl text-dark flex items-center gap-2">
          <Zap size={24} className="text-primary"/> Quick Hire AI
        </p>
        <div className="flex flex-col md:flex-row gap-6 text-body text-center md:text-left">
          <a href="mailto:codexrehan@gmail.com" className="hover:text-primary transition-colors font-medium">codexrehan@gmail.com</a>
          <a href="tel:8266834341" className="hover:text-primary transition-colors font-medium">+91 8266834341</a>
        </div>
        <p className="text-sm text-gray-400">© 2026 Quick Hire. All rights reserved.</p>
      </footer>
    </div>
  );
}
