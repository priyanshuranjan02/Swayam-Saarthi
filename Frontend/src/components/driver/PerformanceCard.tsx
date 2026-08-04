import {
  Trophy,
  Star,
} from "lucide-react";

interface Props {
  rating: number;
  completedTrips: number;
}

export default function PerformanceCard({
  rating,
  completedTrips,
}: Props) {

  const performanceScore =
    Math.min(
      100,
      Math.round(
        rating * 20 +
        completedTrips * 0.5
      )
    );

  let status = "Needs Improvement";

  if (performanceScore >= 90)
    status = "Excellent Driver";
  else if (performanceScore >= 75)
    status = "Very Good";
  else if (performanceScore >= 60)
    status = "Good Driver";

  return (

    <div className="glass-card p-6">

      <div className="flex items-center gap-3 mb-5">

        <Trophy
          className="text-yellow-500"
          size={28}
        />

        <div>

          <h2 className="font-semibold text-xl">
            Performance Score
          </h2>

          <p className="text-muted-foreground text-sm">
            Based on rating & completed trips
          </p>

        </div>

      </div>

      <div className="flex items-center justify-between">

        <div>

          <div className="text-5xl font-bold gradient-text">
            {performanceScore}
          </div>

          <p className="text-muted-foreground">
            /100
          </p>

        </div>

        <div className="text-right">

          <div className="flex justify-end mb-2">

            {Array.from({ length: 5 }).map((_, index) => (

              <Star
                key={index}
                size={20}
                className={
                  index < Math.round(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }
              />

            ))}

          </div>

          <h3 className="font-semibold">

            {status}

          </h3>

          <p className="text-muted-foreground text-sm">

            {rating.toFixed(1)} Rating

          </p>

        </div>

      </div>

    </div>

  );

}