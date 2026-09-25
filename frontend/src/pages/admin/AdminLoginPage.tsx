import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Logo } from '../../components/common/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [username, setUsername] = useState('admin@leox');
  const [password, setPassword] = useState('leoX@4536');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ username, password });
      success('Authentication Verified', 'Welcome to LEOX Production Suite.');
      navigate('/admin/dashboard');
    } catch (err: any) {
      error('Authentication Failed', err.message || 'Invalid credentials. Please verify username/password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDefaultCredentials = () => {
    setUsername('admin@leox');
    setPassword('leoX@4536');
  };

  return (
    <div className="min-h-screen bg-[#060709] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Red Spotlight Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#E50914]/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        {/* Card */}
        <div className="rounded-3xl bg-[#0f1016] border border-[#212330] p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <Logo size="lg" onClick={() => navigate('/')} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[11px] font-extrabold uppercase tracking-widest text-[#FF4D55]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DIRECTOR CONTROL PORTAL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-3">
                LEOX STUDIO ADMIN
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Authorized access for LeoX studio director & lead producers.
              </p>
            </div>
          </div>

          {/* Quick Credential Helper Pill */}
          <div
            onClick={fillDefaultCredentials}
            className="mb-6 p-3 rounded-xl bg-[#171824] border border-[#2b2e40] hover:border-[#E50914]/60 transition-colors cursor-pointer text-xs flex items-center justify-between group"
            title="Click to auto-fill credentials"
          >
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#E50914] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Default Credentials</span>
              </div>
              <div className="text-gray-300 font-mono text-[11px]">
                User: <span className="text-white font-semibold">admin@leox</span> &bull; Pass: <span className="text-white font-semibold">leoX@4536</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase">
              Auto-fill
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@leox"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161722] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161722] border border-[#27293a] text-white text-sm focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              id="admin-login-submit-btn"
              className="w-full py-3.5 rounded-xl bg-[#E50914] hover:bg-[#FF2E36] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-xl shadow-[#E50914]/30 flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
            >
              {submitting ? (
                <span>VERIFYING CREDENTIALS...</span>
              ) : (
                <>
                  <span>AUTHENTICATE & ENTER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="pt-6 mt-6 border-t border-[#1d1e2a] text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              &larr; Return to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
