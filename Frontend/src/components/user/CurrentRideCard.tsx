import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  MapPin,
  Navigation,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RideData {
  _id: string;

  status: string;

  fare: number;

  driverId?: {
    name: string;
  };

  pickupLocation?: {
    name: string;
  };

  dropLocation?: {
    name: string;
  };
}

interface Props {
  ride: RideData;
}

const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-500";

    case "accepted":
      return "text-primary";

    case "confirmed":
      return "text-purple-500";

    case "ongoing":
      return "text-green-500";

    default:
      return "text-muted-foreground";
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Waiting for Driver";

    case "accepted":
      return "Driver Accepted";

    case "confirmed":
      return "Ready to Start";

    case "ongoing":
      return "Ride in Progress";

    default:
      return status;
  }
};

export default function CurrentRideCard({
  ride,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="glass-card p-8 mb-8 border border-primary/20"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Car className="text-primary" />
            Current Ride
          </h2>

          <p className="text-muted-foreground mt-1">
            Your active booking details
          </p>
        </div>

        <span
          className={`font-semibold ${statusColor(
            ride.status
          )}`}
        >
          {statusLabel(ride.status)}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Driver */}

        <div className="flex items-start gap-3">

          <Car className="text-primary mt-1" />

          <div>

            <p className="text-sm text-muted-foreground">
              Driver
            </p>

            <h3 className="font-semibold">
              {ride.driverId?.name || "Searching..."}
            </h3>

          </div>

        </div>

        {/* Fare */}

        <div className="flex items-start gap-3">

          <IndianRupee className="text-green-500 mt-1" />

          <div>

            <p className="text-sm text-muted-foreground">
              Estimated Fare
            </p>

            <h3 className="font-semibold">
              ₹{ride.fare}
            </h3>

          </div>

        </div>

        {/* Pickup */}

        <div className="flex items-start gap-3">

          <MapPin className="text-primary mt-1" />

          <div>

            <p className="text-sm text-muted-foreground">
              Pickup
            </p>

            <h3 className="font-semibold">
              {ride.pickupLocation?.name}
            </h3>

          </div>

        </div>

        {/* Destination */}

        <div className="flex items-start gap-3">

          <Navigation className="text-red-500 mt-1" />

          <div>

            <p className="text-sm text-muted-foreground">
              Destination
            </p>

            <h3 className="font-semibold">
              {ride.dropLocation?.name}
            </h3>

          </div>

        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <Link
          to={`/track-ride/${ride._id}`}
        >
          <Button
            variant="hero"
            className="gap-2"
          >
            Track Ride

            <ArrowRight
              className="h-4 w-4"
            />

          </Button>
        </Link>

      </div>

    </motion.div>
  );
}