import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AdminStatCard from "@/pages/AdminStatCard";
import AdminBookingsTable from "@/pages/AdminBookingsTable";
import AdminAnalyticsCharts from "@/pages/AdminAnalyticsCharts";
import api from "@/lib/api";
import { Users, Car, ClipboardList, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import TopDriversLeaderboard from "@/components/admin/TopDriversLeaderboard";
import LatestReviewsPanel from "@/components/admin/LatestReviewsPanel";
import RecentPaymentsPanel from "@/components/admin/RecentPaymentsPanel";
import SystemActivityFeed from "@/components/admin/SystemActivityFeed";

interface AdminStats {
  users: number;
  drivers: number;
  bookings: number;
  revenue: number;

  newUsersThisMonth: number;
  onlineDrivers: number;
  todayBookings: number;
  todayRevenue: number;
}

interface TopDriver {
  _id: string;
  name: string;
  averageRating: number;
  completedTrips: number;
  totalEarnings: number;
}

interface Review {
  _id: string;
  rating: number;
  feedback: string;
  createdAt: string;
  userId: {
    name: string;
  };

  driverId: {
    name: string;
  };
}

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

interface Activity {
  type: "booking" | "payment" | "review" | "ride" | "driver";
  message: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [topDrivers, setTopDrivers] = useState<TopDriver[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          statsRes,
          driversRes,
          reviewsRes,
          paymentsRes,
          activityRes,
        ] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/top-drivers"),
          api.get("/admin/reviews"),
          api.get("/admin/payments"),
          api.get("/admin/activity"),
        ]);

        setStats(statsRes.data.data);
        setTopDrivers(driversRes.data.data);
        setReviews(reviewsRes.data.data);
        setPayments(paymentsRes.data.data);
        setActivities(activityRes.data.data);
      } catch {
        toast.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <PageLayout>
      <div className="page-container">
        <h1 className="text-3xl font-bold gradient-text mb-6">
          Admin Dashboard
        </h1>

        {loading ? (
          <p className="text-muted-foreground">Loading stats...</p>
        ) : (
          <>
            {/* ================= KPI CARDS ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

              <AdminStatCard
                title="Total Users"
                value={stats?.users || 0}
                icon={Users}
                subtitle={`+${stats?.newUsersThisMonth || 0} this month`}
              />

              <AdminStatCard
                title="Total Drivers"
                value={stats?.drivers || 0}
                icon={Car}
                subtitle={`${stats?.onlineDrivers || 0} online`}
              />

              <AdminStatCard
                title="Total Bookings"
                value={stats?.bookings || 0}
                icon={ClipboardList}
                subtitle={`${stats?.todayBookings || 0} today`}
              />

              <AdminStatCard
                title="Total Revenue"
                value={stats?.revenue || 0}
                icon={IndianRupee}
                prefix="₹"
                subtitle={`₹${stats?.todayRevenue || 0} today`}
              />

            </div>
            
            {/* ================= Analytics ================= */}

            <AdminAnalyticsCharts />

            {/* ================= Top Section ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    
              <TopDriversLeaderboard
                drivers={topDrivers}
              />
            
              <LatestReviewsPanel
                reviews={reviews}
              />
            
            </div>
                    
            {/* ================= Operations ================= */}
                    
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    
              <RecentPaymentsPanel
                payments={payments}
              />
            
              <SystemActivityFeed
                activities={activities}
              />
            
            </div>
                    
            {/* ================= Bookings ================= */}
                    
            <div className="mt-8">
                    
              <AdminBookingsTable />
                    
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;