import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, MapPin, Navigation } from "lucide-react";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";

interface ReceiptData {
  booking: any;
  payment: any;
}

export default function Receipt() {
  const { bookingId } = useParams();

  const [receipt, setReceipt] =
    useState<ReceiptData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await api.get(
          `/payments/receipt/${bookingId}`
        );

        setReceipt(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [bookingId]);

  if (loading) {
    return (
      <PageLayout>
        <div className="page-container max-w-3xl mx-auto">
          <div className="glass-card p-10 space-y-6 animate-pulse">
            <div className="h-8 w-1/2 rounded-md bg-surface-muted shimmer" />
            <div className="h-4 w-1/3 rounded-md bg-surface-muted shimmer" />
            <div className="grid grid-cols-2 gap-6 pt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 rounded-md bg-surface-muted shimmer" />
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!receipt) {
    return (
      <PageLayout>
        <div className="page-container">
          <div className="glass-card mx-auto max-w-md p-10 text-center text-muted-foreground">
            Receipt not found.
          </div>
        </div>
      </PageLayout>
    );
  }

  const { booking, payment } = receipt;

  return (
    <PageLayout>
      <div className="page-container">

        <div className="max-w-3xl mx-auto glass-card p-6 sm:p-10">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">

            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-success/15">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  Swayam <span className="gradient-text">Saarthi</span>
                </h1>
                <p className="text-muted-foreground">
                  Ride Receipt
                </p>
              </div>
            </div>

            <Button
              className="gap-2 shrink-0"
              onClick={() =>
                generateReceiptPdf(
                  booking,
                  payment
                )
              }
            >
              <Download size={18} />
              Download PDF
            </Button>

          </div>

          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border/60 bg-surface-muted/40 p-5 mb-8">

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Booking ID
              </p>
              <p className="font-semibold truncate">
                {booking._id}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Ride Date
              </p>
              <p className="font-semibold">
                {new Date(
                  booking.completedAt
                ).toLocaleString()}
              </p>
            </div>

          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-8">

            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Customer
              </h3>
              <p className="font-medium">{booking.userId.name}</p>
              <p className="text-sm text-muted-foreground">{booking.userId.email}</p>
              <p className="text-sm text-muted-foreground">{booking.userId.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Driver
              </h3>
              <p className="font-medium">{booking.driverId.name}</p>
              <p className="text-sm text-muted-foreground">{booking.driverId.phone}</p>
            </div>

          </div>

          <div className="h-px bg-border mb-8" />

          <div className="space-y-4 mb-4">

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-success" />
              <div className="flex flex-1 justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-medium text-right">{booking.pickupLocation?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Navigation className="h-4 w-4 text-destructive" />
              <div className="flex flex-1 justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium text-right">{booking.dropLocation?.name}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">{booking.routeDistance} km</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{booking.routeDuration} mins</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium uppercase">{payment.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center text-xl font-bold border-t border-border pt-5">
              <span>Total Paid</span>
              <span className="gradient-text">₹{payment.amount}</span>
            </div>

          </div>

          <div className="mt-10 text-center text-sm text-muted-foreground">
            Thank you for choosing
            <br />
            <span className="font-semibold text-foreground">
              Swayam Saarthi
            </span>
          </div>

        </div>

      </div>
    </PageLayout>
  );
}
