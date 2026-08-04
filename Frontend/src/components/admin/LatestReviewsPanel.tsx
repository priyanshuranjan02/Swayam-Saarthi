import {
  Star,
  MessageSquare,
} from "lucide-react";

interface Review {
  _id: string;

  rating: number;

  feedback: string;

  createdAt: string;

  userId: {
    name: string;
  };

  driverId: {
    name: string;
  };
}

interface Props {
  reviews: Review[];
}

export default function LatestReviewsPanel({
  reviews,
}: Props) {
  return (
    <div className="glass-card p-6 h-full">

      <div className="flex items-center gap-3 mb-6">

        <MessageSquare
          className="text-primary"
          size={26}
        />

        <div>

          <h2 className="text-xl font-bold">
            Latest Reviews
          </h2>

          <p className="text-sm text-muted-foreground">
            Recent customer feedback
          </p>

        </div>

      </div>

      {reviews.length === 0 ? (

        <div className="text-center py-10 text-muted-foreground">
          No reviews available
        </div>

      ) : (

        <div className="space-y-5">

          {reviews.map((review) => (

            <div
              key={review._id}
              className="border border-border rounded-xl p-4 hover:bg-secondary/30 transition-all"
            >

              {/* Rating */}

              <div className="flex items-center gap-1 mb-2">

                {Array.from({ length: 5 }).map((_, index) => (

                  <Star
                    key={index}
                    size={16}
                    className={
                      index < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />

                ))}

              </div>

              {/* Feedback */}

              <p className="text-sm italic mb-3">

                "
                {review.feedback || "No written feedback."}
                "

              </p>

              {/* User & Driver */}

              <div className="flex justify-between text-xs text-muted-foreground">

                <span>

                  👤 {review.userId?.name}

                </span>

                <span>

                  🚗 {review.driverId?.name}

                </span>

              </div>

              {/* Date */}

              <p className="text-xs text-muted-foreground mt-2">

                {new Date(
                  review.createdAt
                ).toLocaleString("en-IN")}

              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}