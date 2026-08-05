import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Car, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';

const valueProps = [
  { icon: Car, title: 'Book your own vehicle a driver', desc: 'Skip the taxi, keep your car, hire a trusted driver.' },
  { icon: ShieldCheck, title: 'Verified professionals', desc: 'Every driver is background-checked and rated.' },
  { icon: Clock, title: 'On-demand or scheduled', desc: 'Book instantly or plan ahead for any trip.' },
];

const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      label: "Weak",
      percentage: 30,
      color: "bg-destructive",
      textColor: "text-destructive",
    };
  }

  if (score <= 4) {
    return {
      label: "Medium",
      percentage: 70,
      color: "bg-warning",
      textColor: "text-warning",
    };
  }

  return {
    label: "Strong",
    percentage: 100,
    color: "bg-success",
    textColor: "text-success",
  };
};

const RegisterUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { registerUser, isLoading } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await registerUser(name, email, password);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  return (
    <PageLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
        {/* Left branded panel */}
        <div className="hidden lg:flex relative flex-col justify-between gradient-surface overflow-hidden p-12">
          <div className="absolute inset-0 gradient-primary opacity-90" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-semibold text-primary-foreground">Swayam Saarthi</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-8">
            <h2 className="font-display text-3xl xl:text-4xl font-bold text-primary-foreground leading-tight">
              Join thousands riding <br /> with confidence.
            </h2>
            <div className="space-y-5">
              {valueProps.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-4"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary-foreground/15 backdrop-blur flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-foreground">{item.title}</p>
                    <p className="text-sm text-primary-foreground/75">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Swayam Saarthi. All rights reserved.
          </p>
        </div>

        {/* Right form panel */}
        <div className="flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {/* Logo (mobile) */}
            <div className="text-center mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary-foreground" />
                </div>
              </Link>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Sign up to book drivers for your vehicle</p>
            </div>

            {/* Form */}
            <div className="glass-card p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4 rounded-2xl bg-surface-muted/60 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        aria-invalid={!!errors.name}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl bg-surface-muted/60 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        aria-invalid={!!errors.password}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Password Strength</span>
                        <span className={passwordStrength.textColor}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${passwordStrength.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" /> Minimum 8 characters
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" /> Uppercase &amp; lowercase letters
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" /> Numbers
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" /> Special characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        aria-invalid={!!errors.confirmPassword}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link to="/register/driver" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Want to register as a driver instead?
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RegisterUser;
