import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  Loader2,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { toast } from "sonner";

/* ================= TYPES ================= */
type PaymentMethod = "upi" | "card";

interface Booking {
  pickupLocation: string;
  dropLocation: string;
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

      // 🔥 Mock payment delay
      await new Promise((res) => setTimeout(res, 2000));

      setIsSuccess(true);
      toast.success("Payment successful 🎉");

      // Redirect after animation
      setTimeout(() => {
        navigate("/user");
      }, 2000);
    } catch {
      toast.error("Payment failed. Please try again.");
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
                <h1 className="text-3xl font-bold mb-3">
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
                  <h1 className="text-3xl font-bold mb-2">
                    Complete{" "}
                    <span className="gradient-text">Payment</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Choose your preferred payment method
                  </p>
                </div>

                {/* AMOUNT */}
                <div className="glass-card p-6 mb-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Amount to Pay
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <IndianRupee className="h-8 w-8 text-primary" />
                    <span className="text-4xl font-bold gradient-text">
                      {booking.fare}
                    </span>
                  </div>
                </div>

                {/* PAYMENT METHODS */}
                <div className="space-y-4 mb-8">
                  {/* UPI */}
                  <button
                    onClick={() => setSelectedMethod("upi")}
                    className={`w-full glass-card p-4 flex items-center gap-4 ${
                      selectedMethod === "upi"
                        ? "border-primary ring-2 ring-primary/20"
                        : ""
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">UPI Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Pay using any UPI app
                      </p>
                    </div>
                  </button>

                  {/* CARD */}
                  <button
                    onClick={() => setSelectedMethod("card")}
                    className={`w-full glass-card p-4 flex items-center gap-4 ${
                      selectedMethod === "card"
                        ? "border-primary ring-2 ring-primary/20"
                        : ""
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Card Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Credit or Debit card
                      </p>
                    </div>
                  </button>
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

                <p className="text-center text-xs text-muted-foreground mt-6">
                  🔒 Your payment is secure and encrypted
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