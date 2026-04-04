import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setSent(true);
      toast.success('Reset link sent!');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08)_0%,transparent_60%)]" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-sora font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-primary">QuickHire</span>
              <span className="text-text-primary"> AI</span>
            </h1>
          </Link>
        </div>

        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-sora font-bold text-text-primary mb-2">Check Your Email</h2>
              <p className="text-text-muted mb-6">We've sent a password reset link to <span className="text-primary">{email}</span></p>
              <Link to="/login" className="text-primary font-semibold hover:text-secondary">Back to Login</Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-sora font-bold text-text-primary mb-2">Forgot Password?</h2>
              <p className="text-text-muted text-sm mb-6">Enter your email and we'll send you a reset link.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-primary/15 rounded-xl text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-glow-primary transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : null}
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <Link to="/login" className="flex items-center gap-2 text-text-muted text-sm mt-6 hover:text-text-primary transition-colors justify-center">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
