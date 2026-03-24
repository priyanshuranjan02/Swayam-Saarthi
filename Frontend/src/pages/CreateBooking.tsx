import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooking } from "@/contexts/BookingContext";
import PageLayout from "@/components/layout/PageLayout";
import StepIndicator from "@/components/booking/StepIndicator";
import { toast } from "sonner";

const CreateBooking = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [errors, setErrors] = useState<{ pickup?: string; drop?: string }>({});

  const { createBooking, isLoading } = useBooking();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { pickup?: string; drop?: string } = {};

    if (!pickup.trim()) {
      newErrors.pickup = "Pickup location is required";
    }

    if (!drop.trim()) {
      newErrors.drop = "Drop location is required";
    }

    if (
      pickup.trim().toLowerCase() === drop.trim().toLowerCase()
    ) {
      newErrors.drop = "Drop location must be different from pickup";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const booking = await createBooking(
        pickup.trim(),
        drop.trim()
      );

      // 🔥 CRITICAL FIX: always use MongoDB _id
      const bookingId = booking?._id;

      if (!bookingId) {
        toast.error("Invalid booking response. Please try again.");
        return;
      }

      toast.success("Trip details saved!");
      navigate(`/select-driver/${bookingId}`);
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
    }
  };

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
            currentStep={1}
            totalSteps={3}
            labels={["Trip Details", "Select Driver", "Confirmation"]}
          />

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Enter <span className="gradient-text">Trip Details</span>
            </h1>
            <p className="text-muted-foreground">
              Tell us where you want to go
            </p>
          </div>

          {/* FORM */}
          <div className="glass-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                  <Input
                    id="pickup"
                    type="text"
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.pickup && (
                  <p className="text-sm text-destructive">
                    {errors.pickup}
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <div className="h-8 w-0.5 bg-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drop">Drop Location</Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
                  <Input
                    id="drop"
                    type="text"
                    placeholder="Enter drop location"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.drop && (
                  <p className="text-sm text-destructive">
                    {errors.drop}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* INFO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border/30"
          >
            <p className="text-sm text-muted-foreground text-center">
              💡 You'll be able to select a verified driver in the next step
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default CreateBooking;