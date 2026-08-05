import {
  CheckCircle2,
  Circle,
} from "lucide-react";
import { motion } from "framer-motion";

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
      title: "Driver Accepted",
      completed: true,
    },
    {
      title: "Driver Arrived",
      completed: driverArrived,
    },
    {
      title: "Ride Started",
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

  const currentStep = steps.findIndex((step) => !step.completed);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 sm:p-8"
    >

      <h3 className="text-xl font-bold mb-5">
        Ride Progress
      </h3>

      <div className="relative">

        {steps.map((step, index) => (

          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            className="relative flex min-h-16 items-start gap-4 last:min-h-0"
          >

            {index < steps.length - 1 && (
              <div className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 overflow-hidden rounded-full bg-border">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: step.completed ? "100%" : "0%" }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="w-full bg-success"
                />
              </div>
            )}

            {step.completed ? (

              <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 ring-4 ring-background"
              >
                <CheckCircle2
                  className="text-success"
                  size={20}
                />
              </motion.div>

            ) : (

              <motion.div
                animate={index === currentStep ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: index === currentStep ? Infinity : 0 }}
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background ${
                  index === currentStep ? "bg-primary/15 shadow-glow" : "bg-secondary"
                }`}
              >
                <Circle
                  className={index === currentStep ? "fill-primary text-primary" : "text-muted-foreground"}
                  size={17}
                />
              </motion.div>

            )}

            <div className="pt-1">
              <span
                className={
                step.completed
                    ? "font-semibold text-foreground"
                    : index === currentStep
                      ? "font-semibold text-primary"
                      : "font-medium text-muted-foreground"
                }
              >
                {step.title}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {step.completed ? "Completed" : index === currentStep ? "In progress" : "Upcoming"}
              </p>
            </div>

          </motion.div>

        ))}

      </div>

    </motion.section>
  );
}
