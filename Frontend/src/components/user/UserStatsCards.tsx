import {
  Car,
  IndianRupee,
  Calculator,
  Star,
} from "lucide-react";

interface DashboardStats {
  totalTrips: number;
  moneySpent: number;
  averageFare: number;

  favoriteDriver: {
    name: string;
    trips: number;
  } | null;
}

interface Props {
  stats: DashboardStats;
}

export default function UserStatsCards({
  stats,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {/* Total Trips */}

      <div className="glass-card p-5 sm:p-6">

        <div className="flex items-center gap-4">

          <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">

            <Car
              className="text-primary"
              size={24}
            />

          </div>

          <div>

            <p className="text-sm text-muted-foreground">
              Total Trips
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              {stats.totalTrips}
            </h2>

          </div>

        </div>

      </div>

      {/* Money Spent */}

      <div className="glass-card p-5 sm:p-6">

        <div className="flex items-center gap-4">

          <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center">

            <IndianRupee
              className="text-green-500"
              size={24}
            />

          </div>

          <div>

            <p className="text-sm text-muted-foreground">
              Money Spent
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-green-500">
              ₹{stats.moneySpent}
            </h2>

          </div>

        </div>

      </div>

      {/* Average Fare */}

      <div className="glass-card p-5 sm:p-6">

        <div className="flex items-center gap-4">

          <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">

            <Calculator
              className="text-primary"
              size={24}
            />

          </div>

          <div>

            <p className="text-sm text-muted-foreground">
              Average Fare
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              ₹{stats.averageFare}
            </h2>

          </div>

        </div>

      </div>

      {/* Favorite Driver */}

      <div className="glass-card p-5 sm:p-6">

        <div className="flex items-center gap-4">

          <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">

            <Star
              className="text-yellow-500"
              size={24}
            />

          </div>

          <div>

            <p className="text-sm text-muted-foreground">
              Favorite Driver
            </p>

            <h2 className="text-base sm:text-lg font-bold break-words">

              {stats.favoriteDriver
                ? stats.favoriteDriver.name
                : "--"}

            </h2>

            {stats.favoriteDriver && (

              <p className="text-xs text-muted-foreground">

                {stats.favoriteDriver.trips} Trips Together

              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}