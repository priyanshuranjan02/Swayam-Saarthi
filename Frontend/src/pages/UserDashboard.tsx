import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Clock, MapPin, ArrowRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import UserStatsCards from "@/components/user/UserStatsCards";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import CurrentRideCard from "@/components/user/CurrentRideCard";
import RecentTripsPreview from "@/components/user/RecentTripsPreview";
import RideAnalyticsCard from "@/components/user/RideAnalyticsCard";

interface DashboardStats {
  totalTrips: number;
  moneySpent: number;
  averageFare: number;

  favoriteDriver: {
    name: string;
    trips: number;
  } | null;
}

interface RecentTrip {
  _id: string;
  fare: number;
  completedAt: string;

  driverId?: {
    name: string;
  };

  pickupLocation?: {
    name: string;
  };

  dropLocation?: {
    name: string;
  };
}

interface RideAnalytics {
  monthlySpending: number;
  longestRide: number;
 averageDuration: number;
  mostVisited: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [currentRide, setCurrentRide] = useState<any>(null);
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);
  const [analytics, setAnalytics] = useState<RideAnalytics | null>(null);

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const [
        statsRes,
        rideRes,
        tripsRes,
        analyticsRes,
      ] = await Promise.all([
        api.get("/user/dashboard-stats"),
        api.get("/user/current-ride"),
        api.get("/user/recent-trips"),
        api.get("/user/ride-analytics"),
      ]);

      setStats(statsRes.data.data);
      setCurrentRide(rideRes.data.data);
      setRecentTrips(tripsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  fetchDashboard();
}, []);

  return (
    <PageLayout>
      <div className="page-container min-h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Welcome back,{" "}
              <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Ready to book a driver for your journey?
            </p>
          </div>

          {/* ================= CURRENT RIDE ================= */}

          {currentRide && (
            <CurrentRideCard ride={currentRide} />
          )}

          {stats && (
            <div className="mt-8 mb-8">
              <UserStatsCards
                stats={stats}
              />
            </div>
          )}

          {/* ================= CREATE BOOKING ================= */}

          {!currentRide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                <div className="flex-1">
          
                  <h2 className="text-2xl font-bold mb-3">
                    Create a New Booking
                  </h2>
          
                  <p className="text-muted-foreground mb-6">
                    Book a verified driver for your vehicle in just 3 simple
                    steps.
                  </p>
          
                  <Link to="/create-booking">
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full sm:w-auto gap-2"
                    >
                      <Plus className="h-5 w-5" />
          
                      Create Booking
          
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
          
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= RECENT TRIPS ================= */}

          <RecentTripsPreview
            trips={recentTrips}
          />

          {/* ================= RIDE ANALYTICS ================= */}

          {analytics && (
            <RideAnalyticsCard
              analytics={analytics}
            />
          )}

          {/* ✅ MY TRIPS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between"
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
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                View Trips
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {/* <Link to="/track-ride">
              <Button>
                Track Ride
              </Button>
            </Link> */}
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default UserDashboard;