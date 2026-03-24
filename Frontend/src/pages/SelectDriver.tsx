import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import StepIndicator from "@/components/booking/StepIndicator";
import DriverCard from "@/components/booking/DriverCard";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { toast } from "sonner";
import api from "@/lib/api";

/* ================= TYPES ================= */
interface Driver {
  _id: string;
  name: string;
  email: string;
  rating?: number;
  totalTrips?: number;
  isVerified: boolean;
  isAvailable: boolean;
}

/* ================= COMPONENT ================= */
const SelectDriver = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [selectingDriverId, setSelectingDriverId] = useState<string | null>(
    null
  );

  /* ================= FETCH AVAILABLE DRIVERS ================= */
  useEffect(() => {
    if (!bookingId) {
      toast.error("Invalid booking");
      navigate("/create-booking");
      return;
    }

    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);
        const res = await api.get("/bookings/drivers");
        setDrivers(res.data.data || []);
      } catch (err) {
        toast.error("Failed to load drivers");
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, [bookingId, navigate]);

  /* ================= ASSIGN DRIVER ================= */
  const handleSelectDriver = async (driver: Driver) => {
    try {
      setSelectingDriverId(driver._id);

      await api.post(`/bookings/assign/${bookingId}`, {
        driverId: driver._id,
      });

      toast.success(`${driver.name} selected successfully`);
      navigate(`/booking-confirmation/${bookingId}`);
    } catch (err) {
      toast.error("Failed to assign driver");
    } finally {
      setSelectingDriverId(null);
    }
  };

  return (
    <PageLayout showFooter={false}>
      <div className="page-container min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* STEP INDICATOR */}
          <StepIndicator
            currentStep={2}
            totalSteps={3}
            labels={["Trip Details", "Select Driver", "Confirmation"]}
          />

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Select Your <span className="gradient-text">Driver</span>
            </h1>
            <p className="text-muted-foreground">
              Choose from verified available drivers
            </p>
          </div>

          {/* DRIVER LIST */}
          {loadingDrivers ? (
            <SkeletonList count={4} />
          ) : drivers.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">
              No drivers available at the moment. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drivers.map((driver, index) => (
                <motion.div
                  key={driver._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DriverCard
                    driver={{
                      id: driver._id,
                      name: driver.name,
                      rating: driver.rating || 4.5,
                      trips: driver.totalTrips || 0,
                      isVerified: driver.isVerified,
                    }}
                    onSelect={() => handleSelectDriver(driver)}
                    isLoading={selectingDriverId === driver._id}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* BACK BUTTON */}
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/create-booking")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Trip Details
            </Button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default SelectDriver;