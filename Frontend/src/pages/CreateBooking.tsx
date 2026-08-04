import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, ArrowRight, Loader2 } from "lucide-react";
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Enter <span className="gradient-text">Trip Details</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Tell us where you want to go
            </p>
          </div>

          {/* FORM */}
          <div className="glass-card p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Pickup */}
              <div className="space-y-2">
                <div className="relative">
                  {/* <MapPin className="absolute left-3 top-[52px] h-5 w-5 text-success z-10" /> */}

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
              
              {/* Drop */}
              <div className="space-y-2">
                <div className="relative">
                  {/* <Navigation className="absolute left-3 top-[52px] h-5 w-5 text-destructive z-10" /> */}
              
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
                className="h-[300px] sm:h-[400px] lg:h-[500px] sm:w-auto"
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