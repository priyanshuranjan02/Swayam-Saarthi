import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  IndianRupee,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { toast } from "sonner";
import { LocationResult } from "@/components/location/types";

/* ================= TYPES ================= */
type PaymentMethod = "upi" | "card";

interface Booking {
  pickupLocation: LocationResult;
  dropLocation: LocationResult;

  routeDistance?: number;
  routeDuration?: number;

  fare: number;
  status: string;
}

const Payment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ================= FETCH BOOKING ================= */
  useEffect(() => {
    if (!bookingId || bookingId.length !== 24) {
      toast.error("Invalid booking session");
      navigate("/user");
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data.data);
      } catch {
        toast.error("Booking not found");
        navigate("/user");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  /* ================= HANDLE PAYMENT ================= */
  const handlePayment = async () => {
    if (!booking) return;

    try {
      setIsProcessing(true);

      // Mock payment delay (optional)
      await new Promise((res) => setTimeout(res, 1500));

      await api.post("/payments/pay", {
        bookingId,
        paymentMethod: selectedMethod,
      });

      setIsSuccess(true);

      toast.success("Payment successful 🎉");

      setTimeout(() => {
        navigate(`/track-ride/${bookingId}`);
      }, 2000);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        "Payment failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <PageLayout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!booking) return null;

  const methods: { key: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: "upi",
      label: "UPI Payment",
      desc: "Pay using any UPI app",
      icon: <Smartphone className="h-6 w-6" />,
    },
    {
      key: "card",
      label: "Card Payment",
      desc: "Credit or Debit card",
      icon: <CreditCard className="h-6 w-6" />,
    },
  ];

  return (
    <PageLayout showFooter={false}>
      <div className="page-container min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-success/20 mb-6"
                >
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </motion.div>
                <h1 className="font-display text-3xl font-bold mb-3">
                  Payment Successful!
                </h1>
                <p className="text-muted-foreground mb-4">
                  Your booking has been confirmed
                </p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </motion.div>
            ) : (
              <motion.div key="payment" exit={{ opacity: 0 }}>
                {/* TITLE */}
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                    <Wallet className="h-3.5 w-3.5" />
                    Secure Checkout
                  </span>
                  <h1 className="font-display text-3xl font-bold mb-2">
                    Complete{" "}
                    <span className="gradient-text">Payment</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Choose your preferred payment method
                  </p>
                </div>

                {/* TRIP SUMMARY */}
                <div className="glass-card p-6 mb-6">

                  <div className="flex justify-between mb-4">

                    <span className="text-muted-foreground">
                      Pickup
                    </span>

                    <span className="font-medium text-right">
                      {booking.pickupLocation?.name}
                    </span>

                  </div>

                  <div className="flex justify-between mb-4">

                    <span className="text-muted-foreground">
                      Drop
                    </span>

                    <span className="font-medium text-right">
                      {booking.dropLocation?.name}
                    </span>

                  </div>

                  <div className="h-px bg-border my-4" />

                  <div className="flex justify-between mb-3">

                    <span className="text-muted-foreground">
                      Distance
                    </span>

                    <span className="font-semibold">
                      {booking.routeDistance?.toFixed(1)} km
                    </span>

                  </div>

                  <div className="flex justify-between mb-4">

                    <span className="text-muted-foreground">
                      Estimated Time
                    </span>

                    <span className="font-semibold">
                      {Math.round(booking.routeDuration ?? 0)} mins
                    </span>

                  </div>

                  <div className="h-px bg-border my-4" />

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <IndianRupee className="h-6 w-6 text-primary" />

                      <span className="font-medium">
                        Total Fare
                      </span>

                    </div>

                    <span className="text-3xl font-bold gradient-text">
                      ₹{booking.fare}
                    </span>

                  </div>

                </div>

                {/* PAYMENT METHODS */}
                <div className="space-y-3 mb-8">
                  {methods.map((m) => {
                    const active = selectedMethod === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedMethod(m.key)}
                        className={`w-full glass-card p-4 flex items-center gap-4 transition-all ${
                          active
                            ? "border-primary ring-2 ring-primary/25"
                            : "hover:border-primary/30"
                        }`}
                      >
                        <div
                          className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                            active
                              ? "gradient-primary text-primary-foreground"
                              : "bg-surface-muted text-primary"
                          }`}
                        >
                          {m.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{m.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {m.desc}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                            active ? "border-primary" : "border-border"
                          }`}
                        >
                          {active && (
                            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* PAY BUTTON */}
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full gap-2"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>Pay ₹{booking.fare}</>
                  )}
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground mt-6">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Your payment is secure and encrypted
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Payment;
