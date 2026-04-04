import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, User, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../../stores/authStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Templates', href: '/#templates' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-black/10'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group">
          <span className="text-xl font-sora font-extrabold text-transparent bg-clip-text bg-gradient-primary">
            QuickHire
          </span>
          <span className="text-xl font-sora font-extrabold text-text-primary">AI</span>
        </Link>

        {/* Desktop Nav Links */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-text-muted hover:text-text-primary transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-primary/15 hover:border-primary/30 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-text-primary font-medium max-w-[120px] truncate">{user.name}</span>
                <ChevronDown size={14} className={`text-text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-surface border border-primary/15 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-primary/10">
                      <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => { navigate('/dashboard'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-card transition-colors"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </button>
                      <button
                        onClick={() => { navigate('/build'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-card transition-colors"
                      >
                        <User size={16} /> Build Resume
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-1.5"
              >
                Get Started <span>→</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-text-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-t border-primary/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {isLanding && navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-text-muted hover:text-text-primary py-2 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-primary/10 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="block w-full py-3 text-center bg-primary/10 text-primary rounded-xl font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    <Link to="/build" className="block w-full py-3 text-center bg-primary text-white rounded-xl font-medium" onClick={() => setMobileOpen(false)}>Build Resume</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full py-3 text-center text-red-400 text-sm">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block w-full py-3 text-center text-text-muted hover:text-text-primary" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    <Link to="/register" className="block w-full py-3 text-center bg-gradient-primary text-white rounded-xl font-semibold" onClick={() => setMobileOpen(false)}>Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {userMenuOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setUserMenuOpen(false)} />}
    </nav>
  );
}
