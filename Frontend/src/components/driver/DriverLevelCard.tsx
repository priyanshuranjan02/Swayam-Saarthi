import {
  Award,
  Trophy,
  Medal,
  Crown,
} from "lucide-react";

interface Props {
  completedTrips: number;
}

export default function DriverLevelCard({
  completedTrips,
}: Props) {

  const levels = [
    {
      name: "Bronze",
      icon: Medal,
      limit: 25,
      color: "text-amber-700",
    },
    {
      name: "Silver",
      icon: Award,
      limit: 50,
      color: "text-gray-400",
    },
    {
      name: "Gold",
      icon: Trophy,
      limit: 100,
      color: "text-yellow-500",
    },
    {
      name: "Platinum",
      icon: Crown,
      limit: Infinity,
      color: "text-cyan-400",
    },
  ];

  let current = levels[0];
  let previousLimit = 0;
  let nextLimit = 25;

  for (let i = 0; i < levels.length; i++) {
    if (completedTrips < levels[i].limit) {
      current = levels[i];
      nextLimit = levels[i].limit;
      previousLimit = i === 0 ? 0 : levels[i - 1].limit;
      break;
    }
  }

  const Icon = current.icon;

  const progress =
    nextLimit === Infinity
      ? 100
      : Math.min(
          100,
          ((completedTrips - previousLimit) /
            (nextLimit - previousLimit)) *
            100
        );

  return (
    <div className="glass-card p-6">

      <div className="flex items-center gap-3 mb-5">

        <Icon
          className={current.color}
          size={28}
        />

        <div>

          <h2 className="font-semibold text-xl">
            Driver Level
          </h2>

          <p className="text-muted-foreground">
            Achievement Progress
          </p>

        </div>

      </div>

      <h3
        className={`text-3xl font-bold ${current.color}`}
      >
        {current.name}
      </h3>

      <div className="w-full h-3 bg-secondary rounded-full mt-6 overflow-hidden">

        <div
          className="h-full bg-primary transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {nextLimit !== Infinity && (

        <p className="text-sm text-muted-foreground mt-3">

          {nextLimit - completedTrips} trips to{" "}

          <span className="font-semibold">

            {levels[
              levels.indexOf(current) + 1
            ]?.name}

          </span>

        </p>

      )}

    </div>
  );
}