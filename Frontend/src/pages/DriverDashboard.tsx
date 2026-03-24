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

/* ================= TYPES ================= */
interface DriverProfile {
  name: string;
  email: string;
  isVerified: boolean;
  isAvailable: boolean;
}

interface Booking {
  _id: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  status?: string;
  userId?: {
    name: string;
    email: string;
  };
}

interface EarningsDay {
  date: string;
  amount: number;
}

interface DriverEarnings {
  totalEarnings: number;
  completedTrips: number;
  daily: EarningsDay[];
}

const DriverDashboard = () => {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /* ================= FETCH DRIVER DATA ================= */
const fetchDriverData = async () => {
  try {
    setLoading(true);

    const [profileRes, activeRes, earningsRes] = await Promise.all([
      api.get("/driver/profile"),
      api.get("/bookings/driver/active"),
      api.get("/driver/earnings")
    ]);

    /* PROFILE */
    const driver = profileRes.data.data;
    setProfile(driver);
    setIsOnline(driver.isAvailable);

    /* ACTIVE BOOKING */
    setActiveBooking(activeRes.data.data || null);

    /* ✅ EARNINGS (NORMALIZED) */
    const earningsData = earningsRes.data?.data;

    setEarnings({
      totalEarnings: earningsData?.totalEarnings ?? 0,
      completedTrips: earningsData?.totalTrips ?? 0,
      daily: earningsData?.dailyEarnings ?? []
    });

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
      await api.put(`/bookings/complete/${activeBooking._id}`);
      toast.success("Trip completed");
      fetchDriverData();
    } catch {
      toast.error("Failed to complete trip");
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

          {/* PROFILE + AVAILABILITY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>

              {profile?.isVerified && (
                <span className="inline-flex mt-3 items-center gap-1 px-2 py-1 text-xs rounded-full bg-success/20 text-success">
                  <Shield className="h-3 w-3" /> Verified
                </span>
              )}
            </div>

            <div className="glass-card p-6 flex justify-between items-center">
              <span>{isOnline ? "Online" : "Offline"}</span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
                disabled={updating}
              />
            </div>
          </div>

          {/* 💰 EARNINGS STATS */}
          {earnings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold gradient-text">
                      ₹{earnings.totalEarnings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Trips</p>
                    <p className="text-2xl font-bold">
                      {earnings.completedTrips}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 📊 DAILY EARNINGS */}
          {earnings?.daily?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Recent Earnings</h3>
              <div className="space-y-2">
                {earnings.daily.slice(0, 7).map((day) => (
                  <div key={day.date} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <span className="font-medium">₹{day.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🚗 ACTIVE BOOKING */}
          {activeBooking && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">Active Trip</h3>
              <p><strong>User:</strong> {activeBooking.userId?.name}</p>
              <p><strong>Pickup:</strong> {activeBooking.pickupLocation}</p>
              <p><strong>Drop:</strong> {activeBooking.dropLocation}</p>
              <p><strong>Fare:</strong> ₹{activeBooking.fare}</p>

              <div className="flex gap-4 mt-4">
                {!activeBooking.status || activeBooking.status === "pending" ? (
                  <>
                    <button
                      onClick={acceptBooking}
                      className="flex-1 bg-success text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" /> Accept
                    </button>
                    <button
                      onClick={rejectBooking}
                      className="flex-1 bg-destructive text-white py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={completeRide}
                    className="w-full bg-primary text-white py-2 rounded-lg"
                  >
                    Complete Ride
                  </button>
                )}
              </div>
            </div>
          )}

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