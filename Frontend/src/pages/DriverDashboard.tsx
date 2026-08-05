import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
  List,
  IndianRupee,
  TrendingUp,
  Car,
  Star,
  ArrowRight,
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

interface DriverStats {
  todayEarnings: number;

  totalEarnings: number;

  completedTrips: number;

  averageFare: number;

  averageRating: number;

  totalReviews: number;
}

const activeBookingBadge = (status?: string) => {
  switch (status) {
    case "pending":
      return "bg-warning/15 text-warning border border-warning/30";
    case "accepted":
      return "bg-primary/15 text-primary border border-primary/30";
    case "confirmed":
      return "bg-success/15 text-success border border-success/30";
    case "ongoing":
      return "bg-primary/15 text-primary border border-primary/30";
    default:
      return "bg-secondary text-secondary-foreground border border-border";
  }
};

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Driver <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage availability, trips & earnings
              </p>
            </div>

            <div className="glass-card flex items-center gap-3 px-5 py-3 self-start sm:self-auto">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline ? "bg-success animate-pulse-glow" : "bg-muted-foreground"
                }`}
              />
              <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
                disabled={updating}
              />
            </div>
          </div>

          {/* 🚗 ACTIVE BOOKING */}
          {activeBooking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-6 sm:p-8 border transition-all duration-300 ${
                activeBooking.status === "pending"
                  ? "border-warning/40"
                  : "border-primary/30"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Car className="h-6 w-6 text-primary" />
                    {activeBooking.status === "pending"
                      ? "New Ride Request"
                      : "Current Trip"}
                  </h2>

                  <p className="text-muted-foreground mt-1">
                    {activeBooking.status === "pending"
                      ? "A customer is requesting your ride."
                      : "Manage your current trip."}
                  </p>
                </div>

                <span
                  className={`self-start px-4 py-1 rounded-full text-sm font-medium ${activeBookingBadge(
                    activeBooking.status
                  )}`}
                >
                  {activeBooking.status?.toUpperCase()}
                </span>
              </div>

              {/* Ride Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

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
                      className="flex-1 bg-success hover:opacity-90 transition text-success-foreground py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Accept Ride
                    </button>

                    <button
                      onClick={rejectBooking}
                      className="flex-1 bg-destructive hover:opacity-90 transition text-destructive-foreground py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
                    >
                      <XCircle className="h-5 w-5" />
                      Reject
                    </button>
                  </>
                )}

                {activeBooking.status === "accepted" && (
                  <button
                    disabled
                    className="w-full bg-warning/80 text-warning-foreground py-3 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Waiting for Customer Payment...
                  </button>
                )}

                {activeBooking.status === "confirmed" && (
                  <button
                    onClick={handleStartRide}
                    className="w-full bg-success hover:opacity-90 transition text-success-foreground py-3 rounded-xl font-semibold"
                  >
                    Start Ride
                  </button>
                )}

                {activeBooking.status === "ongoing" && (
                  <button
                    onClick={completeRide}
                    className="w-full bg-primary hover:opacity-90 transition text-primary-foreground py-3 rounded-xl font-semibold"
                  >
                    Complete Ride
                  </button>
                )}

                {activeBooking.status === "completed" && (
                  <button
                    disabled
                    className="w-full bg-muted text-muted-foreground py-3 rounded-xl cursor-not-allowed"
                  >
                    Trip Completed
                  </button>
                )}

              </div>
            </motion.div>
          )}

          {/* PROFILE */}
          <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                <Car className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile?.name}</h2>
                <p className="text-muted-foreground text-sm">{profile?.email}</p>

                {profile?.isVerified && (
                  <span className="inline-flex mt-2 items-center gap-1 px-2 py-1 text-xs rounded-full badge-verified">
                    <Shield className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 💰 EARNINGS STATS */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Today's Earnings */}
              <StatChip
                icon={IndianRupee}
                label="Today's Earnings"
                value={`₹${stats.todayEarnings}`}
                accent="text-success"
                chip="bg-success/15"
              />

              {/* Total Earnings */}
              <StatChip
                icon={IndianRupee}
                label="Total Earnings"
                value={`₹${stats.totalEarnings}`}
                accent="text-primary"
                chip="bg-primary/15"
              />

              {/* Completed Trips */}
              <StatChip
                icon={TrendingUp}
                label="Completed Trips"
                value={`${stats.completedTrips}`}
                accent="text-accent"
                chip="bg-accent/15"
              />

              {/* Driver Rating */}
              <StatChip
                icon={Star}
                label="Driver Rating"
                value={`${stats.averageRating?.toFixed(1) ?? "0.0"}`}
                subtitle={`${stats.totalReviews ?? 0} Reviews`}
                accent="text-warning"
                chip="bg-warning/15"
              />

            </div>
          )}

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

          {weeklyEarnings.length > 0 && (
            <WeeklyEarningsChart
              data={weeklyEarnings}
            />
          )}

          <WeeklyAnalytics
            data={weeklyEarnings}
          />

          {/* 📜 TRIP HISTORY */}
          <div className="glass-card-hover p-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <List className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Trip History</h3>
                <p className="text-sm text-muted-foreground">
                  View completed trips
                </p>
              </div>
            </div>
            <Link to="/driver/trips">
              <button className="px-4 py-2 rounded-lg border border-border flex items-center gap-2 hover:bg-secondary/40 transition-colors">
                View Trips
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

        </motion.div>
      </div>
    </PageLayout>
  );
};

/* ================= STAT CHIP ================= */
const StatChip = ({
  icon: Icon,
  label,
  value,
  subtitle,
  accent,
  chip,
}: {
  icon: any;
  label: string;
  value: string;
  subtitle?: string;
  accent: string;
  chip: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card-hover p-5"
  >
    <div className="flex items-center gap-3">
      <div className={`h-12 w-12 rounded-xl ${chip} flex items-center justify-center shrink-0`}>
        <Icon className={`h-6 w-6 ${accent}`} />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  </motion.div>
);

export default DriverDashboard;
