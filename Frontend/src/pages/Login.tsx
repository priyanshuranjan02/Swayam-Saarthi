import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- LOGIN HANDLER ---------- */
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      // Role hint (backend still decides final role)
      const role = email.toLowerCase().includes('driver') ? 'driver' : 'user';

      const loggedInRole = await login(email, password, role);

      // 🔀 ROLE-BASED REDIRECT
      if (loggedInRole === 'driver') navigate('/driver');
      else if (loggedInRole === 'admin') navigate('/admin');
      else navigate('/user');

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Login failed'
      );
    }
  };

  return (
    <PageLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* 🔥 NO FORM — PURE SPA */}
          <div className="glass-card p-8 space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="button"
              variant="hero"
              className="w-full"
              disabled={isLoading}
              onClick={handleLogin}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Links */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register/user" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>

            <div className="text-center">
              <Link
                to="/register/driver"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Want to become a driver?
              </Link>
            </div>
          </div>

          {/* Demo Hint */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Demo: Emails containing <b>driver</b> login as driver
            </p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Login;