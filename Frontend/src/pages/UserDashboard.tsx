import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Clock, MapPin, ArrowRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="page-container min-h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back,{" "}
              <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground">
              Ready to book a driver for your journey?
            </p>
          </div>

          {/* Create Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">
                  Create a New Booking
                </h2>
                <p className="text-muted-foreground mb-6">
                  Book a verified driver for your vehicle in just 3 simple
                  steps.
                </p>
                <Link to="/create-booking">
                  <Button variant="hero" size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Booking
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ✅ MY TRIPS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <List className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">My Trips</h3>
                <p className="text-sm text-muted-foreground">
                  View all your past and ongoing bookings
                </p>
              </div>
            </div>

            <Link to="/my-trips">
              <Button variant="outline" className="gap-2">
                View Trips
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/track-ride">
              <Button>
                Track Ride
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default UserDashboard;