import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationSearch from "@/components/location/LocationSearch";
import { Label } from "@/components/ui/label";
import { useBooking } from "@/contexts/BookingContext";
import PageLayout from "@/components/layout/PageLayout";
import StepIndicator from "@/components/booking/StepIndicator";
import { toast } from "sonner";
import { LocationResult } from "@/components/location/types";
import { getRoute } from "@/services/routeService";

const CreateBooking = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupLocation, setPickupLocation] = useState<LocationResult | null>(null);
  const [dropLocation, setDropLocation] = useState<LocationResult | null>(null);
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
    
    if (!pickupLocation || !dropLocation) {
      toast.error("Please select locations from the suggestions.");
      return;
    }
  
    try {
      toast.loading("Calculating route...");
    
      // -----------------------------
      // Get real route from OSRM
      // -----------------------------
      const route = await getRoute(
        {
          lat: pickupLocation.lat,
          lon: pickupLocation.lon,
        },
        {
          lat: dropLocation.lat,
          lon: dropLocation.lon,
        }
      );
    
      // -----------------------------
      // Dynamic Fare
      // -----------------------------
      const fare = Math.round(
        40 +
        route.distance * 12 +
        route.duration * 2
      );
    
      toast.dismiss();
    
      const booking = await createBooking(
        pickup.trim(),
        drop.trim(),
      
        pickupLocation,
        dropLocation,
      
        route.distance,
        route.duration,
        fare
      );
    
      const bookingId = booking?._id;
    
      if (!bookingId) {
        toast.error("Invalid booking response.");
        return;
      }
    
      toast.success("Trip details saved!");
    
      navigate(`/select-driver/${bookingId}`);
    
    } catch (error) {
      console.error(error);
    
      toast.dismiss();
    
      toast.error("Unable to calculate route.");
    }
  };

  return (
    <PageLayout showFooter={false}>
      <div className="page-container min-h-[calc(100vh-4rem)]">
        <div className="max-w-2xl mx-auto">
          {/* STEP INDICATOR */}
          <StepIndicator
            currentStep={1}
            totalSteps={3}
            labels={["Trip Details", "Select Driver", "Confirmation"]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* TITLE */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Step 1 of 3
              </span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">
                Where would you like to <span className="gradient-text">go?</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Enter your pickup and drop locations to get started
              </p>
            </div>

            {/* FORM */}
            <div className="glass-card p-5 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Pickup + Drop, connected with route line */}
                <div className="relative space-y-6">
                  <div className="absolute left-[22px] top-14 bottom-14 hidden w-0.5 border-l-2 border-dashed border-border sm:block" />

                  {/* Pickup */}
                  <div className="space-y-2">
                    <LocationSearch
                      icon={<MapPin className="text-success" />}
                      label="Pickup Location"
                      placeholder="Enter pickup location"
                      value={pickup}
                      onChange={setPickup}
                      onLocationSelect={(location) => {
                        setPickup(location.name);
                        setPickupLocation(location);
                      }}
                    />
                    {errors.pickup && (
                      <p className="text-sm text-destructive">
                        {errors.pickup}
                      </p>
                    )}
                  </div>

                  {/* Drop */}
                  <div className="space-y-2">
                    <LocationSearch
                      icon={<Navigation className="text-destructive" />}
                      label="Drop Location"
                      placeholder="Enter drop location"
                      value={drop}
                      onChange={setDrop}
                      onLocationSelect={(location) => {
                        setDrop(location.name);
                        setDropLocation(location);
                      }}
                    />
                    {errors.drop && (
                      <p className="text-sm text-destructive">
                        {errors.drop}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full sm:w-auto sm:min-w-[220px] h-12"
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
                      <ArrowRight className="h-5 w-5 ml-2" />
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
              className="mt-6 flex items-center gap-3 rounded-2xl border border-border/50 bg-surface-muted/60 p-4"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-base">
                💡
              </span>
              <p className="text-sm text-muted-foreground">
                You'll be able to select a verified driver in the next step
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateBooking;
