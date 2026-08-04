import {
  CheckCircle2,
  Circle,
} from "lucide-react";

interface Props {
  status: string;
  driverArrived: boolean;
}

export default function RideProgressTimeline({
  status,
  driverArrived,
}: Props) {

  const steps = [
    {
      title: "Driver Assigned",
      completed: true,
    },
    {
      title: "Payment Completed",
      completed: true,
    },
    {
      title: "Driver Arrived",
      completed: driverArrived,
    },
    {
      title: "Ride Ongoing",
      completed:
        status === "ongoing" ||
        status === "completed",
    },
    {
      title: "Ride Completed",
      completed:
        status === "completed",
    },
  ];

  return (
    <div className="glass-card p-6 mb-8">

      <h3 className="text-xl font-bold mb-5">
        Ride Progress
      </h3>

      <div className="space-y-4">

        {steps.map((step) => (

          <div
            key={step.title}
            className="flex items-center gap-3"
          >

            {step.completed ? (

              <CheckCircle2
                className="text-green-500"
                size={22}
              />

            ) : (

              <Circle
                className="text-muted-foreground"
                size={22}
              />

            )}

            <span
              className={
                step.completed
                  ? "font-medium"
                  : "text-muted-foreground"
              }
            >
              {step.title}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}