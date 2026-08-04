import {
  Trophy,
  Star,
  IndianRupee,
  Car,
} from "lucide-react";

interface Driver {
  _id?: string;
  name: string;
  averageRating: number;
  completedTrips: number;
  totalEarnings: number;
}

interface Props {
  drivers: Driver[];
}

export default function TopDriversLeaderboard({
  drivers,
}: Props) {
  return (
    <div className="glass-card p-6">

      <div className="flex items-center gap-3 mb-6">

        <Trophy
          className="text-yellow-500"
          size={28}
        />

        <div>
          <h2 className="text-xl font-bold">
            Top Drivers
          </h2>

          <p className="text-sm text-muted-foreground">
            Ranked by completed trips & earnings
          </p>
        </div>

      </div>

      <div className="space-y-4">

        {drivers.length === 0 ? (

          <p className="text-muted-foreground text-center py-6">
            No driver data available
          </p>

        ) : (

          drivers.map((driver, index) => {

            const medals = [
              "🥇",
              "🥈",
              "🥉",
              "4️⃣",
              "5️⃣",
            ];

            return (

              <div
                key={driver._id ?? index}
                className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-secondary/30 transition-all"
              >

                <div className="flex items-center gap-4">

                  <div className="text-3xl">
                    {medals[index] ?? "🏅"}
                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      {driver.name}
                    </h3>

                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">

                      <span className="flex items-center gap-1">
                        <Star
                          size={15}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        {driver.averageRating.toFixed(1)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Car size={15} />
                        {driver.completedTrips} Trips
                      </span>

                    </div>

                  </div>

                </div>

                <div className="text-right">

                  <div className="flex items-center justify-end gap-1 text-green-500 font-bold text-lg">

                    <IndianRupee size={18} />

                    {driver.totalEarnings}

                  </div>

                  <p className="text-xs text-muted-foreground">
                    Total Earnings
                  </p>

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>
  );
}