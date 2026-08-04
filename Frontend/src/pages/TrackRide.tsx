import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "@/components/layout/PageLayout";
import LiveMap from "@/components/maps/LiveMap";
import socket from "@/lib/socket";
import api from "@/lib/api";
import { getRoute } from "@/services/routeService";
import { calculateDistance } from "@/utils/locationUtils";
import { toast } from "sonner";
import RideProgressTimeline from "@/components/tracking/RideProgressTimeline";

interface Booking {
  pickupLocation: {
    name: string;
    lat: number;
    lon: number;
  };

  dropLocation: {
    name: string;
    lat: number;
    lon: number;
  };

  driverId?: {
    name: string;
    vehicleNumber?: string;
  };

  status: string;
}

export default function TrackRide() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [route, setRoute] = useState<
    [number, number][]
  >([]);

  const [driverLocation, setDriverLocation] = useState({
      lat: 28.6139,
      lng: 77.2090,
    });
    
    const [targetLocation, setTargetLocation] = useState({
      lat: 28.6139,
      lng: 77.2090,
    });
  
  const [distanceRemaining, setDistanceRemaining] = useState(0);
  const [eta, setEta] = useState(0);
  const [driverArrived, setDriverArrived] = useState(false);
  const [arrivalNotified, setArrivalNotified] = useState(false);

  /* ===============================
     FETCH BOOKING
  =============================== */

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await api.get(
          `/bookings/${bookingId}`
        );

        const bookingData = res.data.data;

        setBooking(bookingData);

        const routeData = await getRoute(
          {
            lat: bookingData.pickupLocation.lat,
            lon: bookingData.pickupLocation.lon,
          },
          {
            lat: bookingData.dropLocation.lat,
            lon: bookingData.dropLocation.lon,
          }
        );

        setRoute(
          routeData.geometry.map(
            ([lon, lat]) => [lat, lon]
          )
        );

      } catch (err) {
        console.error(err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  /* ===============================
     SOCKET
  =============================== */

  useEffect(() => {
    if (!bookingId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", {
      id: bookingId,
      role: "booking",
    });

    const handleDriverLocation = (
      data: any
    ) => {

      if (data.bookingId !== bookingId)
        return;

      setTargetLocation({
          lat: data.latitude,
          lng: data.longitude,
        });
    };

    socket.on(
      "driver:location",
      handleDriverLocation
    );

    const handleRideCompleted = (data: any) => {
      console.log("🔥 RIDE COMPLETED EVENT");
      console.log(data);
        
      const socketBookingId = String(data.bookingId);
      const currentBookingId = String(bookingId);
        
      console.log(socketBookingId);
      console.log(currentBookingId);
        
      if (socketBookingId !== currentBookingId) {
        console.log("❌ Booking IDs don't match");
        return;
      }
  
      console.log("✅ Navigating...");
  
      navigate(`/ride-completed/${currentBookingId}`, {
        replace: true,
      });
    };

    socket.on(
      "ride:completed",
      handleRideCompleted
    );

    return () => {
      socket.off(
        "driver:location",
        handleDriverLocation
      );
    
      socket.off(
        "ride:completed",
        handleRideCompleted
      );
    };
  }, [bookingId]);

  useEffect(() => {
    if (!booking) return;

    const distance =
      calculateDistance(
        driverLocation.lat,
        driverLocation.lng,
        booking.pickupLocation.lat,
        booking.pickupLocation.lon
      );

    setDistanceRemaining(distance);

  }, [driverLocation, booking]);

  useEffect(() => {
    if (distanceRemaining <= 0) {
      setEta(0);
      return;
    }

    // Average city driving speed ≈ 30 km/h
    const averageSpeed = 30;

    const etaMinutes =
      (distanceRemaining / averageSpeed) * 60;

    setEta(Math.max(1, Math.round(etaMinutes)));

  }, [distanceRemaining]);

  useEffect(() => {
    if (!booking) return;

    // 100 meters
    const arrivalThreshold = 0.1;

    if (
      distanceRemaining <= arrivalThreshold &&
      !driverArrived
    ) {
      setDriverArrived(true);
    }

  }, [
    distanceRemaining,
    booking,
    driverArrived,
  ]);

  useEffect(() => {
    if (
      driverArrived &&
      !arrivalNotified
    ) {
      toast.success(
        "🎉 Driver has arrived! Please proceed to your pickup location.",
        {
          duration: 6000,
        }
      );

      setArrivalNotified(true);
    }

  }, [
    driverArrived,
    arrivalNotified,
  ]);

  if (!booking) {
    return (
      <PageLayout>
        <div className="page-container">
          Loading...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-container">

        <div className="mb-8">
            <h1 className="text-4xl font-bold">
                Live Ride Tracking
            </h1>

            <p className="text-muted-foreground mt-2">
                Track your driver in real time and stay updated throughout your journey.
            </p>
        </div>

        <div className="glass-card p-6">

          {/* ================= DRIVER INFO ================= */}

          <div className="mb-8">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  🚗 Driver Information
                </h2>

                <p className="text-muted-foreground">
                  Track your ride in real time
                </p>

              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  booking.status === "ongoing"
                    ? "bg-green-500/15 text-green-500"
                    : booking.status === "confirmed"
                    ? "bg-blue-500/15 text-blue-500"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {booking.status.toUpperCase()}
              </span>

            </div>

            {/* Driver Details */}

            <div className="grid md:grid-cols-2 gap-4 mb-6">

              <div className="glass-card p-4">

                <p className="text-sm text-muted-foreground">
                  Driver
                </p>

                <h3 className="text-xl font-semibold">
                  {booking.driverId?.name ??
                    "Assigned Driver"}
                </h3>

              </div>

              <div className="glass-card p-4">

                <p className="text-sm text-muted-foreground">
                  Vehicle
                </p>

                <h3 className="text-xl font-semibold">
                  {booking.driverId?.vehicleNumber ??
                    "Vehicle Assigned"}
                </h3>

              </div>

            </div>

            {/* Distance & ETA */}

            <div className="grid grid-cols-2 gap-4">

              <div className="glass-card p-5 text-center">

                <p className="text-sm text-muted-foreground">
                  Distance
                </p>

                <h3 className="text-3xl font-bold text-primary mt-1">
                  {distanceRemaining.toFixed(2)} km
                </h3>

              </div>

              <div className="glass-card p-5 text-center">

                <p className="text-sm text-muted-foreground">
                  ETA
                </p>

                <h3 className="text-3xl font-bold text-green-500 mt-1">
                  {eta} min{eta !== 1 ? "s" : ""}
                </h3>

              </div>

            </div>

          </div>

          {driverArrived && (
            <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  🎉
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-500">
                    Driver Has Arrived
                  </h3>

                  <p className="text-muted-foreground">
                    Please proceed to your pickup location.
                  </p>
                </div>
              </div>
            </div>
          )}

          <RideProgressTimeline
              status={booking.status}
              driverArrived={driverArrived}
          />

          {/* ================= LIVE MAP ================= */}

          <LiveMap
            driverLocation={driverLocation}
            setDriverLocation={setDriverLocation}
            targetLocation={targetLocation}
            pickupLocation={{
              lat: booking.pickupLocation.lat,
              lng: booking.pickupLocation.lon,
            }}
            dropLocation={{
              lat: booking.dropLocation.lat,
              lng: booking.dropLocation.lon,
            }}
            route={route}
          />

        </div>

      </div>
    </PageLayout>
  );
}