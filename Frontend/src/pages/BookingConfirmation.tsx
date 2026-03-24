import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  IndianRupee,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import StepIndicator from "@/components/booking/StepIndicator";
import api from "@/lib/api";
import { toast } from "sonner";
import socket from "@/lib/socket";

/* ================= TYPES ================= */
interface Booking {
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  status: string;
  driverId?: {
    name: string;
    email: string;
  };
}

const BookingConfirmation = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BOOKING ================= */
  const fetchBooking = useCallback(async () => {
    if (!bookingId) return;

    try {
      const res = await api.get(`/bookings/${bookingId}`);
      setBooking(res.data.data);
    } catch {
      toast.error("Booking not found");
      navigate("/user");
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!bookingId || bookingId.length !== 24) {
      toast.error("Invalid booking session");
      navigate("/user");
      return;
    }

    fetchBooking();
  }, [bookingId, fetchBooking, navigate]);

  /* ================= 🔔 SOCKET EVENTS ================= */
  useEffect(() => {
    if (!bookingId) return;

    // Driver accepted booking
    socket.on("booking:accepted", (data) => {
      if (data.bookingId === bookingId) {
        toast.success("Driver accepted your booking 🚗");
        fetchBooking(); // refresh booking status
      }
    });

    // Booking completed (optional UX)
    socket.on("booking:completed", (data) => {
      if (data.bookingId === bookingId) {
        toast.success("Trip completed 🎉");
        fetchBooking();
      }
    });

    return () => {
      socket.off("booking:accepted");
      socket.off("booking:completed");
    };
  }, [bookingId, fetchBooking]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <PageLayout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!booking) return null;

  return (
    <PageLayout showFooter={false}>
      <div className="page-container min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* STEP INDICATOR */}
          <StepIndicator
            currentStep={3}
            totalSteps={3}
            labels={["Trip Details", "Select Driver", "Confirmation"]}
          />

          {/* TITLE */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/20 mb-4"
            >
              <CheckCircle2 className="h-8 w-8 text-success" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-2">
              Booking <span className="gradient-text">Confirmed</span>
            </h1>

            <p className="text-muted-foreground">
              {booking.status === "pending"
                ? "Waiting for driver to accept"
                : booking.status === "ongoing"
                ? "Driver is on the way 🚗"
                : "Trip completed"}
            </p>
          </div>

          {/* BOOKING DETAILS */}
          <div className="glass-card p-8 mb-6">
            {/* TRIP */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                TRIP DETAILS
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pickup</p>
                    <p className="font-medium">
                      {booking.pickupLocation}
                    </p>
                  </div>
                </div>

                <div className="ml-5 h-6 border-l-2 border-dashed border-border" />

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Drop</p>
                    <p className="font-medium">
                      {booking.dropLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-6" />

            {/* DRIVER */}
            {booking.driverId && (
              <>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    ASSIGNED DRIVER
                  </h3>
                  <p className="font-semibold text-lg">
                    {booking.driverId.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verified Driver
                  </p>
                </div>
                <div className="h-px bg-border my-6" />
              </>
            )}

            {/* FARE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Estimated Fare
                </span>
              </div>
              <span className="text-2xl font-bold gradient-text">
                ₹{booking.fare}
              </span>
            </div>
          </div>

          {/* ACTION */}
          {booking.status !== "completed" && (
            <Link to={`/payment/${bookingId}`}>
              <button className="w-full px-6 py-3 rounded-xl bg-primary text-white font-semibold">
                Proceed to Payment
              </button>
            </Link>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default BookingConfirmation;