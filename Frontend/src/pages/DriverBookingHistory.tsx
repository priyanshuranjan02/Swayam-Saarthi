import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, IndianRupee, Loader2, User, PackageOpen } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { toast } from "sonner";
import { LocationResult } from "@/components/location/types";

/* ================= TYPES ================= */
interface Booking {
  _id: string;
  pickupLocation: LocationResult;
  dropLocation: LocationResult;
  fare: number;
  status: string;
  createdAt: string;
  userId?: {
    name: string;
    email: string;
  };
}

const FILTERS = ["all", "completed", "ongoing", "pending", "cancelled"] as const;

const statusPill = (status: string) => {
  switch (status) {
    case "completed":
      return "badge-verified";
    case "ongoing":
      return "bg-primary/10 text-primary border border-primary/20";
    case "pending":
      return "bg-warning/10 text-warning border border-warning/20";
    case "cancelled":
      return "bg-destructive/10 text-destructive border border-destructive/20";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const DriverBookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  /* ================= FETCH HISTORY ================= */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/bookings/driver/history");
        setBookings(res.data.data || []);
      } catch {
        toast.error("Failed to load trip history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-container max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Trip <span className="gradient-text">History</span>
          </h1>
          <p className="text-muted-foreground">
            All rides you have completed or are currently driving
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "gradient-primary text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredBookings.length === 0 ? (
          <div className="glass-card p-10 flex flex-col items-center text-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
              <PackageOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold">No trips found</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {filter === "all"
                ? "You haven't driven any trips yet."
                : `You have no ${filter} trips.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card-hover p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {booking.pickupLocation?.name} → {booking.dropLocation?.name}
                    </p>

                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(booking.createdAt).toLocaleString()}
                    </p>

                    {booking.userId && (
                      <p className="text-sm mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {booking.userId.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-left md:text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mb-2 ${statusPill(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                  <div className="flex items-center md:justify-end gap-1 text-lg font-semibold">
                    <IndianRupee className="h-4 w-4" />
                    {booking.fare}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DriverBookingHistory;
