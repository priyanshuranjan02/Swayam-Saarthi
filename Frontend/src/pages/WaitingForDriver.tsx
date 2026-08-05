import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { toast } from "sonner";

import socket from "@/lib/socket";
import PageLayout from "@/components/layout/PageLayout";

export default function WaitingForDriver() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId = location.state?.bookingId;

  useEffect(() => {
    if (!bookingId) {
      toast.error("Invalid booking");
      navigate("/user");
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", {
      id: bookingId,
      role: "booking",
    });

    console.log("✅ Joined booking room:", bookingId);

    socket.onAny((event, ...args) => {
      console.log("📨 SOCKET EVENT:", event, args);
    });

    const handleAccepted = (data: any) => {
      console.log("✅ booking:accepted", data);

      if (String(data.bookingId) !== String(bookingId)) return;

      toast.success(data.message);

      navigate(`/payment/${bookingId}`);
    };

    const handleRejected = (data: any) => {
      console.log("❌ booking:rejected", data);

      if (String(data.bookingId) !== String(bookingId)) return;

      toast.error(data.message);

      navigate(`/select-driver/${bookingId}`);
    };

    socket.on("booking:accepted", handleAccepted);
    socket.on("booking:rejected", handleRejected);

    return () => {
      socket.off("booking:accepted", handleAccepted);
      socket.off("booking:rejected", handleRejected);
      socket.offAny();
    };
  }, [bookingId, navigate]);

  return (
    <PageLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 sm:p-12 text-center max-w-lg w-full"
        >
          {/* RADAR VISUAL */}
          <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center">
            {[0, 0.6, 1.2].map((delay) => (
              <motion.span
                key={delay}
                className="absolute inset-0 rounded-full border-2 border-primary/40"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, delay, ease: "easeOut" }}
              />
            ))}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full gradient-primary shadow-glow">
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Car className="h-9 w-9 text-primary-foreground" />
              </motion.div>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Finding your <span className="gradient-text">driver...</span>
          </h1>

          <p className="text-muted-foreground mt-4">
            Matching with nearby verified drivers.
            <br />
            Please wait while we confirm the best match for your ride.
          </p>

          <div className="mt-6 flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <div className="mt-7 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-1.5 w-1/3 rounded-full gradient-primary"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
