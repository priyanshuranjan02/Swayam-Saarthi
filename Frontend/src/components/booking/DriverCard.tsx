import { motion } from "framer-motion";
import { Star, ShieldCheck, Car, Clock, IndianRupee, Loader2, Languages, Route, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  isVerified?: boolean;
  isAvailable?: boolean;
  vehicle?: string;
  eta?: string;
  price?: number;
  avatar?: string;
  experience?: number;
  completedRides?: number;
  vehicleExpertise?: string;
  languages?: string[];
}

interface DriverCardProps {
  driver: Driver;
  onSelect: (driver: Driver) => void;
  isLoading?: boolean;
}

const DriverCard = ({ driver, onSelect, isLoading }: DriverCardProps) => {
  const initials = driver.name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`glass-card group h-full p-5 transition-shadow duration-300 sm:p-6 ${
        isLoading ? "border-primary/60 shadow-glow" : "hover:shadow-card"
      }`}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
        <div className="relative shrink-0">
          {driver.avatar ? (
            <img src={driver.avatar} alt={`${driver.name} profile`} className="h-14 w-14 rounded-2xl object-cover shadow-soft" />
          ) : (
            <div className="gradient-primary grid h-14 w-14 place-items-center rounded-2xl text-lg font-bold text-primary-foreground shadow-soft">
              {initials}
            </div>
          )}
          {driver.isAvailable !== false && (
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-card bg-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success-foreground" />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="truncate font-display text-lg font-semibold">{driver.name}</h3>
            {driver.isVerified && (
              <span className="badge-verified inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Star className="h-4 w-4 fill-warning text-warning" />
              {driver.rating.toFixed(1)}
            </span>
            <span>{driver.trips} reviews</span>
            <span className="inline-flex items-center gap-1 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/70 bg-surface-muted/60 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Vehicle</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-medium">
                <Car className="h-3.5 w-3.5 shrink-0 text-primary" />
                {driver.vehicle ?? "Sedan"}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/60 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Arrives</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-medium">
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                {driver.eta ?? "5–8 min"}
              </p>
            </div>
            {typeof driver.price === "number" && (
              <div className="rounded-xl border border-border/70 bg-surface-muted/60 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Fare</p>
                <p className="mt-0.5 flex items-center gap-0.5 text-sm font-semibold">
                  <IndianRupee className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {driver.price}
                </p>
              </div>
            )}
            <div className="rounded-xl border border-border/70 bg-surface-muted/60 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Experience</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-medium">
                <Award className="h-3.5 w-3.5 text-primary" /> {driver.experience ?? 1}+ years
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-surface-muted/60 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Completed</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-medium">
                <Route className="h-3.5 w-3.5 text-primary" /> {driver.completedRides ?? driver.trips} rides
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><Car className="h-3.5 w-3.5 text-primary" /><span className="font-medium text-foreground">Expertise:</span> {driver.vehicleExpertise ?? driver.vehicle ?? "Sedan"}</p>
            <p className="flex items-center gap-2"><Languages className="h-3.5 w-3.5 text-primary" /><span className="font-medium text-foreground">Languages:</span> {(driver.languages ?? ["Hindi", "English"]).join(", ")}</p>
          </div>

          <Button
            size="lg"
            className="mt-4 w-full"
            onClick={() => onSelect(driver)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Selecting…
              </>
            ) : (
              "Select driver"
            )}
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default DriverCard;
