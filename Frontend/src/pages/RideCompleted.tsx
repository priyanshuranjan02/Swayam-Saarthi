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
          Loading...
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
          className="glass-card p-10"
        >

          <div className="flex flex-col items-center mb-8">

            <CheckCircle2
              className="text-green-500"
              size={80}
            />

            <h1 className="text-4xl font-bold mt-4">
              Ride Completed
            </h1>

            <p className="text-muted-foreground mt-2">
              Thank you for riding with Swayam Saarthi.
            </p>

          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-3">
              <MapPin className="text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Pickup
                </p>
                <p className="font-semibold">
                  {booking.pickupLocation?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Navigation className="text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Destination
                </p>
                <p className="font-semibold">
                  {booking.dropLocation?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Car className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Driver
                </p>
                <p className="font-semibold">
                  {booking.driverId?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Travel Time
                </p>
                <p className="font-semibold">
                  {booking.routeDuration ? `${Math.round(booking.routeDuration)} mins`: "--"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IndianRupee className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Fare Paid
                </p>
                <p className="font-bold text-2xl">
                  ₹{booking.fare}
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-3">
                Rate your Driver
              </p>

              <div className="flex gap-2">

                {[1,2,3,4,5].map((star)=>(
                  <button
                    key={star}
                    onClick={()=>setRating(star)}
                  >
                    <Star
                      size={34}
                      className={
                        star<=rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }
                    />
                  </button>
                ))}

              </div>
            </div>

            <textarea
              maxLength={500}
              className="w-full mt-5 rounded-lg bg-background border border-border p-4 resize-none"
              rows={4}
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e)=>setFeedback(e.target.value)}
            />

            <Button
              variant="hero"
              className="w-full mt-6"
              disabled={rating === 0}
              onClick={submitRating}
            >
              Submit Rating
            </Button>

          </div>

        </motion.div>

      </div>
    </PageLayout>
  );
}