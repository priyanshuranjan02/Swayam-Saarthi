import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  IndianRupee,
  ArrowRight,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Trip {
  _id: string;

  fare: number;

  completedAt: string;

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
  trips: Trip[];
}

export default function RecentTripsPreview({
  trips,
}: Props) {

  const timeAgo = (date: string) => {
    const diff =
      Date.now() -
      new Date(date).getTime();

    const minutes = Math.floor(diff / 60000);

    if (minutes < 60)
      return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24)
      return `${hours} hr ago`;

    const days = Math.floor(hours / 24);

    if (days === 1)
      return "Yesterday";

    return `${days} days ago`;
  };

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
      className="glass-card p-8 mb-8"
    >

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Recent Trips
          </h2>

          <p className="text-muted-foreground">
            Your last completed rides
          </p>

        </div>

        <Link to="/my-trips">

          <Button
            variant="outline"
            className="gap-2"
          >
            View All

            <ArrowRight
              className="h-4 w-4"
            />

          </Button>

        </Link>

      </div>

      {trips.length === 0 ? (

        <div className="text-center py-8 text-muted-foreground">

          No completed trips yet.

        </div>

      ) : (

        <div className="space-y-5">

          {trips.map((trip) => (

            <div
              key={trip._id}
              className="border border-border rounded-xl p-5 hover:bg-secondary/30 transition-all"
            >

              <div className="grid md:grid-cols-4 gap-4">

                {/* Pickup */}

                <div className="flex gap-3">

                  <MapPin
                    className="text-green-500 mt-1"
                  />

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Pickup
                    </p>

                    <p className="font-semibold">
                      {trip.pickupLocation?.name}
                    </p>

                  </div>

                </div>

                {/* Destination */}

                <div className="flex gap-3">

                  <Navigation
                    className="text-red-500 mt-1"
                  />

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Destination
                    </p>

                    <p className="font-semibold">
                      {trip.dropLocation?.name}
                    </p>

                  </div>

                </div>

                {/* Driver */}

                <div className="flex gap-3">

                  <Car
                    className="text-primary mt-1"
                  />

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Driver
                    </p>

                    <p className="font-semibold">
                      {trip.driverId?.name}
                    </p>

                  </div>

                </div>

                {/* Fare */}

                <div className="flex justify-between items-center">

                  <div>

                    <div className="flex items-center gap-1">

                      <IndianRupee
                        size={18}
                        className="text-green-500"
                      />

                      <span className="font-bold text-lg">
                        {trip.fare}
                      </span>

                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(
                        trip.completedAt
                      )}
                    </p>

                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                    Completed
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </motion.div>
  );
}