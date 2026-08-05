import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  MapPin,
  Navigation,
  IndianRupee,
  Car,
  Clock,
  Star,
  PartyPopper,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

interface Booking {
  _id: string;
  fare: number;
  status: string;
  routeDistance?: number;
  routeDuration?: number;

  pickupLocation?: {
    name: string;
  };

  dropLocation?: {
    name: string;
  };

  driverId?: {
    name: string;
    email: string;
  };
}

const InfoRow = ({
  icon,
  label,
  value,
  tone = "primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: "primary" | "success" | "destructive";
}) => (
  <div className="flex items-center gap-4">
    <div
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
        tone === "success"
          ? "bg-success/15 text-success"
          : tone === "destructive"
          ? "bg-destructive/15 text-destructive"
          : "bg-primary/15 text-primary"
      }`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold truncate">{value}</p>
    </div>
  </div>
);

export default function RideCompleted() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data.data);
      } catch {
        toast.error("Unable to load ride.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const submitRating = async () => {
      if (rating === 0) {
        toast.error("Please select a rating.");
        return;
      }

      try {

        await api.post("/reviews", {
          bookingId,
          rating,
          feedback,
        });

        toast.success("Thank you for your feedback ❤️");

        setTimeout(() => {
          navigate("/user");
        }, 1200);

      } catch (err: any) {

        toast.error(
          err?.response?.data?.message ??
          "Unable to submit review."
        );

      }

    };

  if (loading) {
    return (
      <PageLayout>
        <div className="page-container flex justify-center py-20">
          <div className="glass-card w-full max-w-2xl p-8 space-y-6 animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-full bg-surface-muted shimmer" />
            <div className="mx-auto h-6 w-2/3 rounded-md bg-surface-muted shimmer" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 rounded-xl bg-surface-muted shimmer" />
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!booking) return null;

  return (
    <PageLayout>
      <div className="page-container max-w-3xl mx-auto">

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card overflow-hidden p-6 sm:p-10"
        >

          <div className="flex flex-col items-center mb-8 text-center">

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15 }}
              className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-success/15"
            >
              <CheckCircle2 className="text-success" size={56} />
              <PartyPopper className="absolute -right-2 -top-2 h-7 w-7 text-warning" />
            </motion.div>

            <h1 className="font-display mt-6 text-3xl sm:text-4xl font-bold">
              Ride <span className="gradient-text">Completed</span>
            </h1>

            <p className="text-muted-foreground mt-2">
              Thank you for riding with Swayam Saarthi.
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 rounded-2xl border border-border/60 bg-surface-muted/40 p-5">
            <InfoRow icon={<MapPin className="h-5 w-5" />} label="Pickup" value={booking.pickupLocation?.name} tone="success" />
            <InfoRow icon={<Navigation className="h-5 w-5" />} label="Destination" value={booking.dropLocation?.name} tone="destructive" />
            <InfoRow icon={<Car className="h-5 w-5" />} label="Driver" value={booking.driverId?.name ?? "—"} />
            <InfoRow
              icon={<Clock className="h-5 w-5" />}
              label="Travel Time"
              value={booking.routeDuration ? `${Math.round(booking.routeDuration)} mins` : "--"}
            />
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl gradient-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-3">
              <IndianRupee className="h-6 w-6" />
              <span className="font-medium">Fare Paid</span>
            </div>
            <span className="text-3xl font-bold">₹{booking.fare}</span>
          </div>

          <div className="mt-8">
            <p className="font-semibold mb-3 text-center">
              Rate your Driver
            </p>

            <div className="flex justify-center gap-2">

              {[1,2,3,4,5].map((star)=>(
                <motion.button
                  key={star}
                  whileTap={{ scale: 0.85 }}
                  onClick={()=>setRating(star)}
                >
                  <Star
                    size={34}
                    className={
                      star<=rating
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/40"
                    }
                  />
                </motion.button>
              ))}

            </div>
          </div>

          <textarea
            maxLength={500}
            className="w-full mt-6 rounded-xl bg-background border border-border p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={4}
            placeholder="Share your experience..."
            value={feedback}
            onChange={(e)=>setFeedback(e.target.value)}
          />

          <Button
            variant="hero"
            size="lg"
            className="w-full mt-6"
            disabled={rating === 0}
            onClick={submitRating}
          >
            Submit Rating
          </Button>

        </motion.div>

      </div>
    </PageLayout>
  );
}
