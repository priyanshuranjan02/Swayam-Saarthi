import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
  List,
  IndianRupee,
  TrendingUp
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import PageLayout from "@/components/layout/PageLayout";
import { toast } from "sonner";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import useDriverLocation from "@/hooks/useDriverLocation";
import { LocationResult } from "@/components/location/types";
import WeeklyEarningsChart from "@/components/driver/WeeklyEarningsChart";
import WeeklyAnalytics from "@/components/driver/WeeklyAnalytics";
import PerformanceCard from "@/components/driver/PerformanceCard";
import DriverLevelCard from "@/components/driver/DriverLevelCard";

/* ================= TYPES ================= */
interface DriverProfile {
  name: string;
  email: string;

  isVerified: boolean;
  isAvailable: boolean;

  averageRating: number;
  totalReviews: number;
}

interface Booking {
  _id: string;
  pickupLocation: LocationResult;
  dropLocation: LocationResult;
  fare: number;
  status?: string;
  userId?: {
    name: string;
    email: string;
  };
}

// interface EarningsDay {
//   date: string;
//   amount: number;
// }

interface DriverStats {
  todayEarnings: number;

  totalEarnings: number;

  completedTrips: number;

  averageFare: number;

  averageRating: number;

  totalReviews: number;
}

const DriverDashboard = () => {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState<{
    date: string;
    earnings: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  useDriverLocation(
    activeBooking?._id,
    activeBooking?.status === "ongoing"
  );

  /* ================= FETCH DRIVER DATA ================= */
const fetchDriverData = async () => {
  try {
    setLoading(true);

    const [dashboardRes, weeklyRes] =
      await Promise.all([
        api.get("/driver/dashboard"),
        api.get("/driver/weekly-earnings"),
      ]);

    // /* PROFILE */
    // const driver = profileRes.data.data;
    // setProfile(driver);
    // setIsOnline(driver.isAvailable);

    // /* ACTIVE BOOKING */
    // setActiveBooking(activeRes.data.data || null);

    // /* ✅ EARNINGS (NORMALIZED) */
    // const earningsData = earningsRes.data?.data;

    // setStats({
    //   todayEarnings: earningsData?.todayEarnings ?? 0,
    //   totalEarnings: earningsData?.totalEarnings ?? 0,
    //   completedTrips: earningsData?.completedTrips ?? 0,
    //   averageFare: earningsData?.averageFare ?? 0,
    //   averageRating: earningsData?.averageRating ?? 0,
    //   totalReviews: earningsData?.totalReviews ?? 0
    // });

    const dashboard =
      dashboardRes.data.data;

      setProfile(
        dashboard.profile
      );

      setIsOnline(
        dashboard.profile.isAvailable
      );

      setActiveBooking(
        dashboard.activeRide
      );

      setStats(
        dashboard.stats
      );

      setWeeklyEarnings(
        weeklyRes.data.data
      );

  } catch (error) {
    console.error(error);
    toast.error("Failed to load driver dashboard");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchDriverData();
}, []);


  /* ================= TOGGLE AVAILABILITY ================= */
  const handleToggleOnline = async (checked: boolean) => {
    try {
      setUpdating(true);
      await api.patch("/driver/availability", { isAvailable: checked });
      setIsOnline(checked);
      toast.success(checked ? "You are now online" : "You are now offline");
    } catch {
      toast.error("Failed to update availability");
    } finally {
      setUpdating(false);
    }
  };

  /* ================= BOOKING ACTIONS ================= */
  const acceptBooking = async () => {
    if (!activeBooking) return;
    try {
      await api.post(`/bookings/driver/accept/${activeBooking._id}`);
      toast.success("Booking accepted");
      fetchDriverData();
    } catch {
      toast.error("Failed to accept booking");
    }
  };

  const rejectBooking = async () => {
    if (!activeBooking) return;
    try {
      await api.post(`/bookings/driver/reject/${activeBooking._id}`);
      toast.success("Booking rejected");
      fetchDriverData();
    } catch {
      toast.error("Failed to reject booking");
    }
  };

  const completeRide = async () => {
    if (!activeBooking) return;

    try {
      await api.patch(
        `/bookings/complete/${activeBooking._id}`
      );

      toast.success("Ride completed");
      fetchDriverData();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        "Unable to complete ride"
      );
    }
  };

  const handleStartRide = async () => {
    if (!activeBooking) return;

    try {
      await api.patch(
        `/driver/booking/${activeBooking._id}/start`
      );

      toast.success("Ride started");

      fetchDriverData(); // or fetchBookings()
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        "Unable to start ride"
      );
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-container">
        <motion.div className="max-w-5xl mx-auto space-y-8">

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold">
              Driver <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Manage availability, trips & earnings
            </p>
          </div>

          {/* 🚗 ACTIVE BOOKING */}
          <div className="mb-8">
            {activeBooking && (
              <div
                className={`glass-card p-8 border transition-all duration-300 ${
                  activeBooking.status === "pending"
                    ? "border-yellow-500/40"
                    : "border-primary/30"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {activeBooking.status === "pending"
                        ? "🚘 New Ride Request"
                        : "🚗 Current Trip"}
                    </h2>
                      
                    <p className="text-muted-foreground mt-1">
                      {activeBooking.status === "pending"
                        ? "A customer is requesting your ride."
                        : "Manage your current trip."}
                    </p>
                  </div>
                      
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      activeBooking.status === "pending"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : activeBooking.status === "accepted"
                        ? "bg-blue-500/15 text-blue-400"
                        : activeBooking.status === "confirmed"
                        ? "bg-green-500/15 text-green-400"
                        : activeBooking.status === "ongoing"
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {activeBooking.status.toUpperCase()}
                  </span>
                </div>
                  
                {/* Ride Details */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Customer
                    </p>
                  
                    <p className="font-semibold text-lg">
                      {activeBooking.userId?.name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fare
                    </p>
                  
                    <p className="text-2xl font-bold text-primary">
                      ₹{activeBooking.fare}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pickup
                    </p>
                  
                    <p className="font-medium">
                      {activeBooking.pickupLocation?.name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Destination
                    </p>
                  
                    <p className="font-medium">
                      {activeBooking.dropLocation?.name}
                    </p>
                  </div>
                  
                </div>
                  
                {/* Action Buttons */}
                  
                <div className="flex flex-col sm:flex-row gap-4">
                  
                  {activeBooking.status === "pending" && (
                    <>
                      <button
                        onClick={acceptBooking}
                        className="flex-1 bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Accept Ride
                      </button>
                  
                      <button
                        onClick={rejectBooking}
                        className="flex-1 bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
                      >
                        <XCircle className="h-5 w-5" />
                        Reject
                      </button>
                    </>
                  )}

                  {activeBooking.status === "accepted" && (
                    <button
                      disabled
                      className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Waiting for Customer Payment...
                    </button>
                  )}

                  {activeBooking.status === "confirmed" && (
                    <button
                      onClick={handleStartRide}
                      className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl font-semibold"
                    >
                      🚗 Start Ride
                    </button>
                  )}

                  {activeBooking.status === "ongoing" && (
                    <button
                      onClick={completeRide}
                      className="w-full bg-primary hover:opacity-90 transition text-white py-3 rounded-xl font-semibold"
                    >
                      Complete Ride
                    </button>
                  )}

                  {activeBooking.status === "completed" && (
                    <button
                      disabled
                      className="w-full bg-muted text-muted-foreground py-3 rounded-xl cursor-not-allowed"
                    >
                      ✅ Trip Completed
                    </button>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* PROFILE + AVAILABILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 glass-card p-6">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>

              {profile?.isVerified && (
                <span className="inline-flex mt-3 items-center gap-1 px-2 py-1 text-xs rounded-full bg-success/20 text-success">
                  <Shield className="h-3 w-3" /> Verified
                </span>
              )}
            </div>

            <div className="glass-card p-6 flex flex-col sm:flex-row gap-3 sm:justify-between items-center">
              <span>{isOnline ? "Online" : "Offline"}</span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
                disabled={updating}
              />
            </div>
          </div>

          {/* 💰 EARNINGS STATS */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
              {/* Today's Earnings */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-6 w-6 text-green-500" />

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Today's Earnings
                    </p>

                    <p className="text-2xl font-bold text-green-500">
                      ₹{stats.todayEarnings}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-6 w-6 text-primary" />

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earnings
                    </p>

                    <p className="text-2xl font-bold gradient-text">
                      ₹{stats.totalEarnings}
                    </p>
                  </div>
                </div>
              </div>

              {/* Completed Trips */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Completed Trips
                    </p>

                    <p className="text-2xl font-bold">
                      {stats.completedTrips}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              ⭐
              <div>
                <p className="text-sm text-muted-foreground">
                  Driver Rating
                </p>

                <p className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1) ?? "0.0"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {stats.totalReviews ?? 0} Reviews
                </p>
              </div>
            </div>
          </div>

          <PerformanceCard
            rating={stats.averageRating}
            completedTrips={stats.completedTrips}
          />

          <DriverLevelCard
            completedTrips={stats.completedTrips}
          />

          <div className="glass-card p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Average Fare
              </p>

              <p className="text-2xl font-bold gradient-text">
                ₹{stats.averageFare ?? 0}
              </p>
            </div>
          </div>

          {/* 📊 DAILY EARNINGS */}
          {/* {stats?.daily?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Recent Earnings</h3>
              <div className="space-y-2">
                {stats.daily.slice(0, 7).map((day) => (
                  <div key={day.date} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <span className="font-medium">₹{day.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {weeklyEarnings.length > 0 && (
            <WeeklyEarningsChart
              data={weeklyEarnings}
            />
          )}

          <WeeklyAnalytics
            data={weeklyEarnings}
          />

          {/* 📜 TRIP HISTORY */}
          <div className="glass-card p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <List className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Trip History</h3>
                <p className="text-sm text-muted-foreground">
                  View completed trips
                </p>
              </div>
            </div>
            <Link to="/driver/trips">
              <button className="px-4 py-2 rounded-lg border border-border">
                View Trips
              </button>
            </Link>
          </div>

        </motion.div>
      </div>
    </PageLayout>
  );
};

export default DriverDashboard;