import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Payment {
  _id: string;

  amount: number;

  paymentMethod: string;

  status: string;

  createdAt: string;

  userId?: {
    name: string;
  };

  bookingId?: {
    driverId?: {
      name: string;
    };
  };
}

interface Props {
  payments: Payment[];
}

export default function RecentPaymentsPanel({
  payments,
}: Props) {
  return (
    <div className="glass-card p-6 h-full">

      <div className="flex items-center gap-3 mb-6">

        <CreditCard
          className="text-primary"
          size={26}
        />

        <div>

          <h2 className="text-xl font-bold">
            Recent Payments
          </h2>

          <p className="text-sm text-muted-foreground">
            Latest successful transactions
          </p>

        </div>

      </div>

      {payments.length === 0 ? (

        <div className="text-center py-10 text-muted-foreground">
          No payments found
        </div>

      ) : (

        <div className="space-y-4">

          {payments.map((payment) => (

            <div
              key={payment._id}
              className="border border-border rounded-xl p-4 hover:bg-secondary/30 transition-all"
            >

              <div className="flex justify-between items-start">

                <div>

                  <div className="flex items-center gap-2">

                    <IndianRupee
                      size={18}
                      className="text-green-500"
                    />

                    <span className="font-bold text-lg">
                      {payment.amount}
                    </span>

                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {payment.paymentMethod.toUpperCase()}
                  </p>

                  <p className="text-sm mt-2">
                    👤 {payment.userId?.name ?? "User"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    🚗 {payment.bookingId?.driverId?.name ?? "Driver"}
                  </p>

                </div>

                <div className="text-right">

                  <div className="flex items-center gap-1 justify-end">

                    {payment.status === "success" ? (
                      <>
                        <CheckCircle2
                          size={18}
                          className="text-green-500"
                        />
                        <span className="text-green-500 font-medium">
                          Success
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={18}
                          className="text-red-500"
                        />
                        <span className="text-red-500 font-medium">
                          Failed
                        </span>
                      </>
                    )}

                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(
                      payment.createdAt
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}