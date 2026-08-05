import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Navigation2, Timer, CheckCircle2, Star, MapPin } from "lucide-react";

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
    vehicleType?: string;
    avatar?: string;
    averageRating?: number;
  };

  status: string;
}

const statusPill = (status: string) => {
  switch (status) {
    case "ongoing":
      return "bg-success/15 text-success border border-success/30";
    case "confirmed":
      return "bg-primary/15 text-primary border border-primary/30";
    default:
      return "bg-secondary text-secondary-foreground border border-border";
  }
};

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
        <div className="page-container min-h-[50vh] flex items-center justify-center text-muted-foreground">
          Loading ride details…
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-container">

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
                Live Ride Tracking
            </h1>

            <p className="text-muted-foreground mt-2">
                Track your driver in real time and stay updated throughout your journey.
            </p>
          </div>

          <span
            className={`self-start sm:self-auto px-4 py-2 rounded-full text-sm font-semibold ${statusPill(
              booking.status
            )}`}
          >
            {booking.status.toUpperCase()}
          </span>
        </div>

        {/* ================= RIDE STATUS ================= */}
        <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 sm:p-6"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-4">
                {booking.driverId?.avatar ? (
                  <img src={booking.driverId.avatar} alt={`${booking.driverId.name} profile`} className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-soft" />
                ) : (
                  <div className="gradient-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-primary-foreground shadow-soft">
                    {(booking.driverId?.name ?? "Assigned Driver").split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your driver</p>
                  <h3 className="truncate font-display text-xl font-bold">
                    {booking.driverId?.name ?? "Assigned Driver"}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground"><Star className="h-4 w-4 fill-warning text-warning" />{booking.driverId?.averageRating?.toFixed(1) ?? "—"}</span>
                    <span>{booking.driverId?.vehicleType ?? "Vehicle"}</span>
                    <span>•</span>
                    <span>{booking.driverId?.vehicleNumber ?? "Assigned"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-surface-muted/60 px-4 py-3 sm:flex-col sm:items-end">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusPill(booking.status)}`}>{booking.status.toUpperCase()}</span>
                <div className="flex items-center gap-2 text-success"><Timer className="h-4 w-4" /><span className="font-bold">{eta} min{eta !== 1 ? "s" : ""}</span></div>
              </div>
            </div>
          </motion.div>
          {driverArrived ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-success/30 bg-success/10 p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-success">
                    Driver Has Arrived
                  </h3>

                  <p className="text-muted-foreground text-sm">
                    Please proceed to your pickup location.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card flex items-center gap-4 p-6">
              <HIPStatusIcon />
              <div><p className="text-sm text-muted-foreground">Driver is on the way</p><p className="mt-1 font-bold">Arriving in approximately {eta} min{eta !== 1 ? "s" : ""}</p></div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <RideProgressTimeline
              status={booking.status}
              driverArrived={driverArrived}
          />
        </div>

        {/* ================= MAP ================= */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div><h2 className="font-display text-xl font-bold">Live location</h2><p className="text-sm text-muted-foreground">Driver movement updates in real time</p></div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Navigation2 className="h-4 w-4" />{distanceRemaining.toFixed(2)} km away</div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-card [&_.leaflet-container]:!h-[300px] sm:[&_.leaflet-container]:!h-[420px]">
            <LiveMap
              driverLocation={driverLocation}
              setDriverLocation={setDriverLocation}
              targetLocation={targetLocation}
              pickupLocation={{ lat: booking.pickupLocation.lat, lng: booking.pickupLocation.lon }}
              dropLocation={{ lat: booking.dropLocation.lat, lng: booking.dropLocation.lon }}
              route={route}
            />
          </div>
        </section>

        {/* ================= TRIP DETAILS ================= */}
        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">Trip details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/15"><MapPin className="h-4 w-4 text-success" /></div><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pickup</p><p className="mt-1 font-semibold">{booking.pickupLocation.name}</p></div></div>
            <div className="flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15"><MapPin className="h-4 w-4 text-primary" /></div><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Destination</p><p className="mt-1 font-semibold">{booking.dropLocation.name}</p></div></div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}

function HIPStatusIcon() {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
      <motion.span className="absolute inset-0 rounded-xl border border-primary/30" animate={{ scale: [1, 1.25], opacity: [0.7, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <Car className="h-6 w-6 text-primary" />
    </div>
  );
}
