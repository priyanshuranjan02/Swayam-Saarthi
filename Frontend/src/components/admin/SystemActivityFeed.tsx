import {
  Car,
  ClipboardList,
  CreditCard,
  MessageSquare,
} from "lucide-react";

interface Activity {
  type: "booking" | "payment" | "review" | "ride" | "driver";
  message: string;
  createdAt: string;
}

interface Props {
  activities: Activity[];
}

export default function SystemActivityFeed({
  activities,
}: Props) {

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "booking":
        return (
          <ClipboardList
            className="text-blue-500"
            size={20}
          />
        );

      case "payment":
        return (
          <CreditCard
            className="text-green-500"
            size={20}
          />
        );

      case "review":
        return (
          <MessageSquare
            className="text-yellow-500"
            size={20}
          />
        );

      case "ride":
        return (
          <Car
            className="text-purple-500"
            size={20}
          />
        );

      case "driver":
        return (
          <Car
            className="text-primary"
            size={20}
          />
        );

      default:
        return (
          <ClipboardList
            size={20}
          />
        );
    }
  };

  const timeAgo = (date: string) => {
    const diff =
      Date.now() -
      new Date(date).getTime();

    const minutes = Math.floor(
      diff / 60000
    );

    if (minutes < 1)
      return "Just now";

    if (minutes < 60)
      return `${minutes} min ago`;

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24)
      return `${hours} hr ago`;

    const days = Math.floor(
      hours / 24
    );

    return `${days} day ago`;
  };

  return (
    <div className="glass-card p-6 h-full">

      <div className="mb-6">

        <h2 className="text-xl font-bold">
          System Activity
        </h2>

        <p className="text-sm text-muted-foreground">
          Latest platform events
        </p>

      </div>

      {activities.length === 0 ? (

        <div className="text-center py-8 text-muted-foreground">
          No recent activity
        </div>

      ) : (

        <div className="space-y-5 max-h-[500px] overflow-y-auto">

          {activities.map(
            (activity, index) => (

              <div
                key={index}
                className="flex gap-4"
              >

                <div className="mt-1">
                  {getIcon(
                    activity.type
                  )}
                </div>

                <div className="flex-1">

                  <p className="font-medium">
                    {activity.message}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {timeAgo(
                      activity.createdAt
                    )}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}