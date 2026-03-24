import { motion } from 'framer-motion';
import { Star, Shield, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Driver } from '@/contexts/BookingContext';

interface DriverCardProps {
  driver: Driver;
  onSelect: (driver: Driver) => void;
  isLoading?: boolean;
}

const DriverCard = ({ driver, onSelect, isLoading }: DriverCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 transition-all duration-300 hover:border-primary/30"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {driver.name.charAt(0)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate">{driver.name}</h3>
            {driver.isVerified && (
              <span className="badge-verified px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-primary fill-primary" />
              {driver.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              {driver.trips.toLocaleString()} trips
            </span>
          </div>

          <Button
            variant="hero"
            size="sm"
            className="w-full"
            onClick={() => onSelect(driver)}
            disabled={isLoading}
          >
            Select Driver
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DriverCard;
