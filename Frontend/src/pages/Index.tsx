import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Car,
  Clock,
  CheckCircle2,
  Users,
  Zap,
  Star,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { useEffect, useState } from "react";
import {
  getLandingData,
  type LandingData,
} from "@/services/publicService";
import { Card, CardContent } from '@/components/ui/card';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Avatar } from '@/components/ui/avatar';

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
  const [landingData, setLandingData] = useState<LandingData | null>(null);

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
      icon: MapPin,
    },
    {
      number: '02',
      title: 'Choose Your Driver',
      description: 'Browse verified drivers and select the one you prefer.',
      icon: Users,
    },
    {
      number: '03',
      title: 'Confirm & Pay',
      description: 'Review your booking, confirm, and pay securely.',
      icon: CheckCircle2,
    },
  ];

  const stats = [
    {
      icon: Users,
      value: landingData?.stats.users ?? "0+",
      label: "Happy Users",
    },
    {
      icon: Car,
      value: landingData?.stats.drivers ?? "0+",
      label: "Verified Drivers",
    },
    {
      icon: MapPin,
      value: landingData?.stats.trips ?? "0+",
      label: "Trips Completed",
    },
    {
      icon: Star,
      value: landingData?.stats.rating ?? 0,
      label: "Average Rating",
    },
  ];

  const testimonials = landingData?.testimonials || [];

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const data = await getLandingData();
        setLandingData(data);
      } catch (error) {
        console.error(
          "Failed to load landing page data:",
          error
        );
      }
    };

    fetchLandingData();
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden section-container pt-20 md:pt-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-[28rem] h-[28rem] bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
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
                <Sparkles className="h-4 w-4" />
                Reverse Ride-Hailing Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card-hover p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1 font-display">
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
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wide mb-4">
              Why Us
            </span>
            <h2 className="section-title text-3xl md:text-4xl mb-4">
              Why Choose <span className="gradient-text">Swayam Saarthi</span>?
            </h2>
            <p className="text-muted-foreground">
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
                whileHover={{ y: -4 }}
                className="glass-card-hover p-6 text-center group"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-4 shadow-soft transition-transform duration-300 group-hover:scale-110">
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
      <section className="section-container relative overflow-hidden">
        <div className="absolute inset-0 gradient-surface pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wide mb-4">
              Simple Process
            </span>
            <h2 className="section-title text-3xl md:text-4xl mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground">
              Book a driver in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-8 text-center h-full flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center text-xs font-bold text-primary">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center absolute top-1/2 -right-7 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-soft">
                    <ArrowRight className="h-4 w-4 text-primary" />
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
              <h2 className="section-title text-3xl md:text-4xl mb-6">
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
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
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
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-soft shrink-0">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold truncate">Join Our Community</h3>
                  <p className="text-sm text-muted-foreground">
                    {landingData
                      ? `${landingData.stats.users} satisfied users`
                      : "Loading..."}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Join our growing community of verified riders and professional drivers.
                Experience safe, reliable and convenient travel with Swayam Saarthi.
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

      {/* Testimonials Section */}
      <section className="section-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wide mb-4">
              Testimonials
            </span>
            <h2 className="section-title text-3xl md:text-4xl mb-4">
              Loved by <span className="gradient-text">Riders &amp; Drivers</span>
            </h2>
            <p className="text-muted-foreground">
              Real stories from people who use Swayam Saarthi every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="h-full rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
              
                      {/* Rating */}
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      
                      {/* Review */}
                      <p className="text-muted-foreground italic mb-6">
                        "{testimonial.review}"
                      </p>
                      
                      {/* User */}
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {testimonial.user?.fullname?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      
                        <div>
                          <h4 className="font-semibold">
                            {testimonial.user?.fullname || "Anonymous"}
                          </h4>
                      
                          <p className="text-sm text-muted-foreground">
                            Driver: {testimonial.driver?.fullname || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <p className="text-muted-foreground">
                  No customer reviews available yet.
                </p>
              </div>
            )}
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
            className="glass-card p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-primary opacity-90 pointer-events-none" />
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 text-primary-foreground">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="mb-8 max-w-xl mx-auto opacity-90">
                Join Swayam Saarthi today and experience the future of personal transportation.
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

export default Index;
