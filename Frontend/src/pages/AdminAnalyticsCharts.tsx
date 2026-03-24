import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface RevenueData {
  date: string;
  revenue: number;
}

interface BookingData {
  date: string;
  count: number;
}

const AdminAnalyticsCharts = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setRevenueData(res.data.data.dailyRevenue);
        setBookingData(res.data.data.dailyBookings);
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading analytics...</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* 📈 Daily Revenue */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Daily Bookings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Bookings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalyticsCharts;