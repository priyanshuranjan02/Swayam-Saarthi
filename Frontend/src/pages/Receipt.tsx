import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
        <div className="page-container">
          Loading receipt...
        </div>
      </PageLayout>
    );
  }

  if (!receipt) {
    return (
      <PageLayout>
        <div className="page-container">
          Receipt not found.
        </div>
      </PageLayout>
    );
  }

  const { booking, payment } = receipt;

  return (
    <PageLayout>
      <div className="page-container">

        <div className="max-w-3xl mx-auto glass-card p-10">

          <div className="flex justify-between items-start mb-10">

            <div>

              <h1 className="text-3xl font-bold">
                Swayam Saarthi
              </h1>

              <p className="text-muted-foreground">
                Ride Receipt
              </p>

            </div>

            <Button
              className="gap-2"
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

          <div className="grid grid-cols-2 gap-8 mb-8">

            <div>

              <p className="text-sm text-muted-foreground">
                Booking ID
              </p>

              <p className="font-semibold">
                {booking._id}
              </p>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Ride Date
              </p>

              <p className="font-semibold">
                {new Date(
                  booking.completedAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

          <hr className="my-8" />

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <h3 className="font-bold mb-4">
                Customer
              </h3>

              <p>{booking.userId.name}</p>

              <p>{booking.userId.email}</p>

              <p>{booking.userId.phone}</p>

            </div>

            <div>

              <h3 className="font-bold mb-4">
                Driver
              </h3>

              <p>{booking.driverId.name}</p>

              <p>{booking.driverId.phone}</p>

            </div>

          </div>

          <hr className="my-8" />

          <div className="space-y-5">

            <div className="flex justify-between">

              <span>Pickup</span>

              <span>
                {booking.pickupLocation?.name}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Destination</span>

              <span>
                {booking.dropLocation?.name}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Distance</span>

              <span>
                {booking.routeDistance} km
              </span>

            </div>

            <div className="flex justify-between">

              <span>Duration</span>

              <span>
                {booking.routeDuration} mins
              </span>

            </div>

            <div className="flex justify-between">

              <span>Payment Method</span>

              <span className="uppercase">
                {payment.paymentMethod}
              </span>

            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-5">

              <span>Total Paid</span>

              <span>
                ₹{payment.amount}
              </span>

            </div>

          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">

            Thank you for choosing
            <br />

            <span className="font-semibold">
              Swayam Saarthi
            </span>

          </div>

        </div>

      </div>
    </PageLayout>
  );
}