import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  IndianRupee,
  CheckCircle2,
  Loader2,
  Clock,
  Gauge,
  UserRound,
  ArrowRight,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import StepIndicator from "@/components/booking/StepIndicator";
import api from "@/lib/api";
import { toast } from "sonner";
import socket from "@/lib/socket";
import { LocationResult } from "@/components/location/types";

/* ================= TYPES ================= */
interface Booking {
  pickupLocation: LocationResult;
  dropLocation: LocationResult;

  routeDistance?: number;
  routeDuration?: number;

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
        <div className="max-w-4xl mx-auto">
          <StepIndicator
            currentStep={3}
            totalSteps={3}
            labels={["Trip Details", "Select Driver", "Confirmation"]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start"
          >
            <div>
              {/* TITLE */}
              <div className="text-center lg:text-left mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/20 mb-4"
                >
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </motion.div>

                <h1 className="font-display text-3xl font-bold mb-2">
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

              {/* TRIP DETAILS CARD */}
              <div className="glass-card p-6 sm:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  Trip Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-success/15 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-success" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="font-medium truncate">
                        {booking.pickupLocation?.name}
                      </p>
                    </div>
                  </div>

                  <div className="ml-5 h-6 border-l-2 border-dashed border-border" />

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-destructive/15 flex items-center justify-center">
                      <Navigation className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Drop</p>
                      <p className="font-medium truncate">
                        {booking.dropLocation?.name}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.driverId && (
                  <>
                    <div className="h-px bg-border my-6" />
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center">
                        <UserRound className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned Driver</p>
                        <p className="font-semibold">{booking.driverId.name}</p>
                      </div>
                      <span className="badge-verified ml-auto rounded-full px-2.5 py-1 text-[11px] font-semibold">
                        Verified
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SUMMARY PANEL - sticky on desktop */}
            <div className="lg:sticky lg:top-40">
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Fare Summary
                </h3>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="h-4 w-4" /> Distance
                  </span>
                  <span className="font-semibold">
                    {booking.routeDistance?.toFixed(1)} km
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" /> Estimated Time
                  </span>
                  <span className="font-semibold">
                    {Math.round(booking.routeDuration ?? 0)} mins
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
                      <IndianRupee className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Estimated Fare</span>
                  </div>
                  <span className="text-2xl font-bold gradient-text">
                    ₹{booking.fare}
                  </span>
                </div>

                {booking.status !== "completed" && (
                  <Link to={`/payment/${bookingId}`} className="block pt-2">
                    <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5">
                      Proceed to Payment
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BookingConfirmation;
