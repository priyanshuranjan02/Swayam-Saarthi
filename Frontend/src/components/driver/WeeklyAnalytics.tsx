import {
  TrendingUp,
  TrendingDown,
  Calendar,
  IndianRupee,
  Trophy,
} from "lucide-react";

interface DayData {
  date: string;
  earnings: number;
}

interface Props {
  data: DayData[];
}

export default function WeeklyAnalytics({
  data,
}: Props) {
  if (!data.length) return null;

  const total = data.reduce(
    (sum, item) => sum + item.earnings,
    0
  );

  const average = total / data.length;

  const highest = data.reduce((a, b) =>
    a.earnings > b.earnings ? a : b
  );

  const lowest = data.reduce((a, b) =>
    a.earnings < b.earnings ? a : b
  );

  return (
    <div className="glass-card p-6 mt-8">

      <h2 className="text-xl font-semibold mb-6">
        Weekly Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <div>
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <TrendingUp size={18} />
            <span className="text-sm">
              Highest Day
            </span>
          </div>

          <p className="text-2xl font-bold">
            ₹{highest.earnings}
          </p>

          <p className="text-muted-foreground text-sm">
            {new Date(highest.date).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <TrendingDown size={18} />
            <span className="text-sm">
              Lowest Day
            </span>
          </div>

          <p className="text-2xl font-bold">
            ₹{lowest.earnings}
          </p>

          <p className="text-muted-foreground text-sm">
            {new Date(lowest.date).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Calendar size={18} />
            <span className="text-sm">
              Average / Day
            </span>
          </div>

          <p className="text-2xl font-bold">
            ₹{average.toFixed(0)}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <Trophy size={18} />
            <span className="text-sm">
              Best Day
            </span>
          </div>

          <p className="text-2xl font-bold">
            {new Date(highest.date).toLocaleDateString("en-IN", {
              weekday: "long",
            })}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <IndianRupee size={18} />
            <span className="text-sm">
              Total Week
            </span>
          </div>

          <p className="text-2xl font-bold gradient-text">
            ₹{total}
          </p>
        </div>

      </div>

    </div>
  );
}