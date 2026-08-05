import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, ShieldCheck, Star } from "lucide-react";
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

  averageRating?: number;
  totalReviews?: number;

  isVerified: boolean;
  isAvailable: boolean;
  avatar?: string;
  experience?: number;
  completedRides?: number;
  vehicle?: string;
  vehicleExpertise?: string;
  languages?: string[];
  eta?: string;
  estimatedFare?: number;
}

type SortKey = "rating" | "trips" | "name";

/* ================= COMPONENT ================= */
const SelectDriver = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [selectingDriverId, setSelectingDriverId] = useState<string | null>(
    null
  );
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

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
      navigate("/waiting", {
        state: {
          bookingId,
        },
      });
    } catch (err) {
      toast.error("Failed to assign driver");
    } finally {
      setSelectingDriverId(null);
    }
  };

  /* ================= FILTER + SORT (presentation only) ================= */
  const visibleDrivers = useMemo(() => {
    let list = [...drivers];
    if (verifiedOnly) list = list.filter((d) => d.isVerified);

    list.sort((a, b) => {
      if (sortKey === "rating") return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      if (sortKey === "trips") return (b.totalReviews ?? 0) - (a.totalReviews ?? 0);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [drivers, sortKey, verifiedOnly]);

  return (
    <PageLayout showFooter={false}>
      <div className="page-container min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto">
          {/* STEP INDICATOR */}
          <StepIndicator
            currentStep={2}
            totalSteps={3}
            labels={["Trip Details", "Select Driver", "Confirmation"]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* TITLE */}
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl font-bold mb-2">
                Select Your <span className="gradient-text">Driver</span>
              </h1>
              <p className="text-muted-foreground">
                Choose from verified available drivers
              </p>
            </div>

            {/* FILTER / SORT CHROME */}
            {!loadingDrivers && drivers.length > 0 && (
              <div className="glass-card mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <SlidersHorizontal className="h-4 w-4" />
                  {visibleDrivers.length} driver{visibleDrivers.length !== 1 && "s"} available
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifiedOnly((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      verifiedOnly
                        ? "badge-verified"
                        : "border border-border bg-surface-muted text-muted-foreground"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified only
                  </button>

                  <div className="flex items-center gap-1 rounded-full border border-border bg-surface-muted p-1 text-xs font-medium">
                    {([
                      { key: "rating", label: "Top rated" },
                      { key: "trips", label: "Most reviews" },
                      { key: "name", label: "Name" },
                    ] as { key: SortKey; label: string }[]).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSortKey(opt.key)}
                        className={`rounded-full px-3 py-1 transition-colors ${
                          sortKey === opt.key
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DRIVER LIST */}
            {loadingDrivers ? (
              <SkeletonList count={4} />
            ) : drivers.length === 0 ? (
              <div className="glass-card p-10 text-center text-muted-foreground">
                <Star className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                No drivers available at the moment. Please try again later.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleDrivers.map((driver, index) => (
                    <motion.div
                      key={driver._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <DriverCard
                        driver={{
                          id: driver._id,
                          name: driver.name,
                        
                          rating: driver.averageRating ?? 0,
                        
                          trips: driver.totalReviews ?? 0,
                        
                          isVerified: driver.isVerified,
                          isAvailable: driver.isAvailable,
                          avatar: driver.avatar,
                          experience: driver.experience,
                          completedRides: driver.completedRides,
                          vehicle: driver.vehicle,
                          vehicleExpertise: driver.vehicleExpertise,
                          languages: driver.languages,
                          eta: driver.eta,
                          price: driver.estimatedFare,
                        }}
                        onSelect={() =>
                          handleSelectDriver(driver)
                        }
                        isLoading={
                          selectingDriverId === driver._id
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
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
      </div>
    </PageLayout>
  );
};

export default SelectDriver;
