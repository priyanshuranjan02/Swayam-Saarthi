import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, IndianRupee, Loader2 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { toast } from "sonner";

/* ================= TYPES ================= */
interface Booking {
  _id: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  status: string;
  createdAt: string;
  driverId?: {
    name: string;
    email: string;
  };
}

const UserBookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH HISTORY ================= */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/bookings/user");
        setBookings(res.data.data || []);
      } catch {
        toast.error("Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            My <span className="gradient-text">Trips</span>
          </h1>
          <p className="text-muted-foreground">
            View all your past and ongoing bookings
          </p>
        </div>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            No bookings found
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {booking.pickupLocation} → {booking.dropLocation}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(booking.createdAt).toLocaleString()}
                    </p>

                    {booking.driverId && (
                      <p className="text-sm mt-1">
                        <strong>Driver:</strong> {booking.driverId.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      booking.status === "completed"
                        ? "badge-verified"
                        : booking.status === "ongoing"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {booking.status}
                  </span>

                  <div className="flex items-center justify-end gap-1 text-lg font-semibold">
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

export default UserBookingHistory;