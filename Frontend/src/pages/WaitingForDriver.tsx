import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="glass-card p-10 text-center max-w-lg">
          <Loader2 className="h-14 w-14 animate-spin mx-auto text-primary" />

          <h1 className="text-3xl font-bold mt-6">
            Waiting for Driver
          </h1>

          <p className="text-muted-foreground mt-4">
            Your booking request has been sent.
            <br />
            Please wait while the driver accepts your ride.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}