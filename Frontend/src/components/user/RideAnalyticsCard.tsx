import {
  IndianRupee,
  Map,
  Clock,
  MapPin,
} from "lucide-react";

interface Analytics {
  monthlySpending: number;
  longestRide: number;
  averageDuration: number;
  mostVisited: string;
}

interface Props {
  analytics: Analytics;
}

export default function RideAnalyticsCard({
  analytics,
}: Props) {
  return (
    <div className="glass-card p-8 mb-8">

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Ride Analytics
        </h2>

        <p className="text-muted-foreground">
          Your travel insights this month
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Monthly Spending */}

        <div className="rounded-xl border border-border p-5">

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">

              <IndianRupee
                className="text-green-500"
                size={24}
              />

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                This Month
              </p>

              <h3 className="text-2xl font-bold text-green-500">
                ₹{analytics.monthlySpending}
              </h3>

            </div>

          </div>

        </div>

        {/* Longest Ride */}

        <div className="rounded-xl border border-border p-5">

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">

              <Map
                className="text-blue-500"
                size={24}
              />

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Longest Ride
              </p>

              <h3 className="text-2xl font-bold text-blue-500">
                {analytics.longestRide.toFixed(1)} km
              </h3>

            </div>

          </div>

        </div>

        {/* Most Visited */}

        <div className="rounded-xl border border-border p-5">

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">

              <MapPin
                className="text-red-500"
                size={24}
              />

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Most Visited
              </p>

              <h3 className="text-xl font-bold">
                {analytics.mostVisited}
              </h3>

            </div>

          </div>

        </div>

        {/* Average Ride Duration */}

        <div className="rounded-xl border border-border p-5">

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">

              <Clock
                className="text-yellow-500"
                size={24}
              />

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Avg Duration
              </p>

              <h3 className="text-2xl font-bold text-yellow-500">
                {analytics.averageDuration} mins
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}