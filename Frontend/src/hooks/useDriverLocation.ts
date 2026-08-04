import { useEffect } from "react";
import socket from "@/lib/socket";
import api from "@/lib/api";

const useDriverLocation = (
  bookingId?: string,
  enabled = false
) => {
  useEffect(() => {
    if (!enabled || !bookingId) return;

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          // ===============================
          // Save latest location in MongoDB
          // ===============================
          await api.put(
            `/bookings/${bookingId}/location`,
            {
              latitude,
              longitude,
            }
          );

          // ===============================
          // Broadcast location to user
          // ===============================
          socket.emit("driver:location", {
            bookingId,
            latitude,
            longitude,
          });

        } catch (err) {
          console.error(
            "Failed to update driver location:",
            err
          );
        }
      },

      (err) => {
        console.error(
          "Geolocation Error:",
          err
        );
      },

      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };

  }, [bookingId, enabled]);
};

export default useDriverLocation;