import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AdminStatCard from "@/pages/AdminStatCard";
import AdminBookingsTable from "@/pages/AdminBookingsTable";
import AdminAnalyticsCharts from "@/pages/AdminAnalyticsCharts";
import api from "@/lib/api";
import { Users, Car, ClipboardList, IndianRupee } from "lucide-react";
import { toast } from "sonner";

interface AdminStats {
  users: number;
  drivers: number;
  bookings: number;
  revenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
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
            {/* 📊 STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AdminStatCard
                title="Total Users"
                value={stats?.users || 0}
                icon={Users}
              />
              <AdminStatCard
                title="Total Drivers"
                value={stats?.drivers || 0}
                icon={Car}
              />
              <AdminStatCard
                title="Total Bookings"
                value={stats?.bookings || 0}
                icon={ClipboardList}
              />
              <AdminStatCard
                title="Total Revenue"
                value={stats?.revenue || 0}
                icon={IndianRupee}
                prefix="₹"
              />
            </div>
            
            {/* 📊 Analytics Charts */}
            <AdminAnalyticsCharts />

            {/* 📋 Recent Bookings Table */}
            <AdminBookingsTable />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;