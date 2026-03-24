import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Car, Clock, CheckCircle2, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';

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

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: 'Verified Drivers',
      description: 'Every driver is background-checked and verified for your safety.',
    },
    {
      icon: Car,
      title: 'Your Own Vehicle',
      description: 'Use your own car with a professional driver of your choice.',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book drivers anytime - for one trip or recurring needs.',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Quick and seamless booking process in just 3 steps.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Trip Details',
      description: 'Tell us your pickup and drop locations for the journey.',
    },
    {
      number: '02',
      title: 'Choose Your Driver',
      description: 'Browse verified drivers and select the one you prefer.',
    },
    {
      number: '03',
      title: 'Confirm & Pay',
      description: 'Review your booking, confirm, and pay securely.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Users' },
    { value: '5K+', label: 'Verified Drivers' },
    { value: '50K+', label: 'Trips Completed' },
    { value: '4.9', label: 'Average Rating' },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden section-container pt-20 md:pt-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="h-4 w-4" />
                Reverse Ride-Hailing Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Your Car.{' '}
              <span className="gradient-text">Our Driver.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Book verified, professional drivers for your own vehicle. Whether it's a 
              daily commute or a special trip, we've got you covered.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register/user">
                <Button variant="hero" size="xl" className="gap-2">
                  Book a Driver
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register/driver">
                <Button variant="hero-outline" size="xl">
                  Become a Driver
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Swayam Saarthi</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the convenience of having a professional driver for your own vehicle, 
              with complete safety and flexibility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-hover p-6 text-center"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-4">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-container bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Book a driver in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-8 text-center h-full">
                  <div className="text-6xl font-bold gradient-text opacity-20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="gradient-text">Swayam Saarthi</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Swayam Saarthi is a revolutionary platform that connects vehicle owners with 
                verified, professional drivers. Unlike traditional ride-hailing services where 
                you book a car, we provide skilled drivers for your own vehicle.
              </p>
              <p className="text-muted-foreground mb-8">
                Whether you need a driver for daily commutes, long trips, or special occasions, 
                our platform ensures you get reliable, background-verified professionals who 
                treat your vehicle with care.
              </p>
              
              <div className="space-y-4">
                {[
                  'All drivers are thoroughly verified',
                  'Flexible booking options',
                  'Secure payment processing',
                  'Real-time trip tracking',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Join Our Community</h3>
                  <p className="text-sm text-muted-foreground">10,000+ satisfied users</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who trust Swayam Saarthi for their driving needs. 
                Experience the convenience and safety of our platform.
              </p>
              <Link to="/register/user">
                <Button variant="hero" className="w-full gap-2">
                  Get Started Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join Swayam Saarthi today and experience the future of personal transportation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register/user">
                  <Button variant="hero" size="lg" className="gap-2">
                    Book a Driver
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register/driver">
                  <Button variant="hero-outline" size="lg">
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

export default Index;
