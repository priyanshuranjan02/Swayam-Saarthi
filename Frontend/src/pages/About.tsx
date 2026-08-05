import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Radio,
  UsersRound,
  Wallet,
  History,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: LayoutDashboard,
    title: 'User, Driver & Admin Dashboards',
    description: 'Purpose-built dashboards that give every role exactly the tools they need.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure JWT Authentication',
    description: 'Industry-standard authentication keeps every account and session protected.',
  },
  {
    icon: Radio,
    title: 'Real-Time Booking Updates',
    description: 'Live status updates powered by Socket.IO keep everyone perfectly in sync.',
  },
  {
    icon: UsersRound,
    title: 'Driver Selection & Management',
    description: 'Browse verified profiles and manage bookings with complete transparency.',
  },
  {
    icon: Wallet,
    title: 'Payment Tracking',
    description: 'Track every transaction with a clear, reliable, and secure payment trail.',
  },
  {
    icon: History,
    title: 'Booking History & Earnings',
    description: 'Detailed history and earnings insights for riders and driver partners alike.',
  },
];

const About = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden section-container pt-20 md:pt-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                About the Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight"
            >
              About <span className="gradient-text">Swayam Saarthi</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground mb-4"
            >
              Swayam Saarthi is a reverse ride-hailing platform that allows users
              to hire verified drivers for their own vehicles.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              The platform connects vehicle owners with professional drivers,
              providing a safe, convenient, and reliable driving experience.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wide mb-4">
              Platform Features
            </span>
            <h2 className="section-title text-3xl md:text-4xl mb-4">
              Built for <span className="gradient-text">Trust & Reliability</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need for a seamless, secure driver-hiring experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card-hover p-6"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary mb-4 shadow-soft shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-primary opacity-90 pointer-events-none" />
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 text-primary-foreground">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Experience It Yourself
              </h2>
              <p className="mb-8 max-w-xl mx-auto opacity-90">
                Create an account and see why thousands trust Swayam Saarthi for
                their driving needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register/user">
                  <Button variant="secondary" size="lg" className="gap-2">
                    Book a Driver
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register/driver">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                  >
                    Join as Driver
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
