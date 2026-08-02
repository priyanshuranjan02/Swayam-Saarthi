import { useEffect } from "react";
import socket from "@/lib/socket";

const useDriverLocation = (
  bookingId?: string,
  enabled = false
) => {

  useEffect(() => {

    if (!enabled || !bookingId) return;

    let watchId: number;

    if (!navigator.geolocation) return;

    watchId = navigator.geolocation.watchPosition(

      (position) => {

        socket.emit("driver:location", {

          bookingId,

          latitude: position.coords.latitude,

          longitude: position.coords.longitude,

        });

      },

      (err) => {

        console.error(err);

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