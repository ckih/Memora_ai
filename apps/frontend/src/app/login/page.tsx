'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success('Registration successful!', {
          description: 'Please check your email for a confirmation link.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0f1e]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-indigo p-8 rounded-[2rem] space-y-8 relative text-white">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
              <BrainCircuit className="text-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? 'Join Memora to start building your career memory.'
                : 'Enter your credentials to access your dashboard.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-4">
              <div className="relative group text-white">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group text-white">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white font-bold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isSignUp ? 'Get Started' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center mt-8 text-muted-foreground/40 uppercase tracking-[0.2em]">
          Secure Authentication • Powered by Supabase
        </p>
      </motion.div>
    </div>
  );
}
