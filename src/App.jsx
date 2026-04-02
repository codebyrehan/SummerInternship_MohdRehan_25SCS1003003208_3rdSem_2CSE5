import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';

import Landing from './pages/Landing';
import ResumeForm from './pages/ResumeForm';
import Preview from './pages/Preview';
import Portfolio from './pages/Portfolio';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/build" element={<ResumeForm />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/portfolio/:username" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
