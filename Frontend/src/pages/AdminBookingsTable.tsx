import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Booking {
  _id: string;
  userId?: { name: string };
  driverId?: { name: string };
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  status: string;
  createdAt: string;
}

const AdminBookingsTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/admin/bookings");
        setBookings(res.data.data);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // 🔥 Sort by most recent first
  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [bookings]);

  // 🔢 Show only 10 unless expanded
  const visibleBookings = showAll
    ? sortedBookings
    : sortedBookings.slice(0, 10);

  if (loading) {
    return (
      <p className="text-muted-foreground mt-6">Loading bookings...</p>
    );
  }

  return (
    <div className="glass-card mt-8 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Bookings</h2>

        {sortedBookings.length > 10 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-sm text-primary hover:underline"
          >
            {showAll ? "Show Less" : "See More"}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3 text-left">User</th>
              <th className="py-3 text-left">Driver</th>
              <th className="py-3 text-left">Trip</th>
              <th className="py-3 text-right">Fare</th>
              <th className="py-3 text-left">Status</th>
              <th className="py-3 text-right">Date</th>
            </tr>
          </thead>

          <tbody>
            {visibleBookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-b border-border/40 hover:bg-secondary/20"
              >
                <td className="py-3">
                  {booking.userId?.name || "Unknown"}
                </td>
                <td className="py-3">
                  {booking.driverId?.name || "Not Assigned"}
                </td>
                <td className="py-3">
                  {booking.pickupLocation} → {booking.dropLocation}
                </td>
                <td className="py-3 text-right">
                  ₹{booking.fare}
                </td>
                <td className="py-3 capitalize">
                  {booking.status}
                </td>
                <td className="py-3 text-right">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedBookings.length === 0 && (
          <p className="text-center text-muted-foreground py-6">
            No bookings found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsTable;