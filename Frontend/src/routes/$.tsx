import { createFileRoute } from "@tanstack/react-router";
import SpaMount from "@/components/SpaMount";

/**
 * Catch-all: every non-root path is handled by the existing React Router SPA.
 * Route paths are unchanged (/login, /user, /track-ride/:bookingId, …).
 */
export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Swayam Saarthi" },
      {
        name: "description",
        content:
          "Manage bookings, pick verified drivers, track your ride live and pay securely with Swayam Saarthi.",
      },
      { property: "og:title", content: "Swayam Saarthi — Rides, Tracking & Payments" },
      {
        property: "og:description",
        content:
          "Manage bookings, pick verified drivers, track your ride live and pay securely with Swayam Saarthi.",
      },
    ],
  }),
  component: SpaMount,
});
