import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';

// Pages
import Landing from './pages/Landing';
const ResumeForm = lazy(() => import('./pages/ResumeForm'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Lazy-load optional pages with fallback
let Preview, Portfolio, ForgotPassword;
try {
  Preview = lazy(() => import('./pages/Preview').catch(() => ({ default: () => null })));
  Portfolio = lazy(() => import('./pages/Portfolio').catch(() => ({ default: () => null })));
  ForgotPassword = lazy(() => import('./pages/ForgotPassword').catch(() => ({ default: () => null })));
} catch {
  const Null = () => null;
  Preview = Portfolio = ForgotPassword = Null;
}

const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      <span className="text-white/50 font-medium text-sm">Loading...</span>
    </div>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/build" element={<ResumeForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/portfolio/:username" element={<Portfolio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    try { initialize(); } catch {}
  }, []);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#12132a',
            color: '#f1f5f9',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#12132a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#12132a' } },
        }}
      />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
