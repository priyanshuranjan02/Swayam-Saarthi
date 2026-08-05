import { createFileRoute } from "@tanstack/react-router";
import SpaMount from "@/components/SpaMount";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swayam Saarthi — Book a ride in seconds" },
      {
        name: "description",
        content:
          "Swayam Saarthi is a modern ride-booking platform: instant bookings, verified drivers, live ride tracking and secure payments.",
      },
      { property: "og:title", content: "Swayam Saarthi — Book a ride in seconds" },
      {
        property: "og:description",
        content:
          "Instant bookings, verified drivers, live tracking and secure payments — all in one premium ride experience.",
      },
    ],
  }),
  component: SpaMount,
});
