import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { Loader2, IndianRupee, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { toast } from "sonner";

/* ================= TYPES ================= */
interface DailyEarning {
  date: string;
  amount: number;
}

interface EarningsData {
  total: number;
  completedTrips: number;
  daily: DailyEarning[];
}

const DriverEarnings = () => {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH EARNINGS ================= */
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get("/driver/earnings");
        const apiData = res.data?.data;

        const dailySorted: DailyEarning[] = (apiData.daily || [])
          .map((d: any) => ({
            date: d.date,
            amount: Number(d.amount) || 0
          }))
          .sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setData({
          total: Number(apiData.total) || 0,
          completedTrips: Number(apiData.completedTrips) || 0,
          daily: dailySorted
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!data) return null;

  return (
    <PageLayout>
      <div className="page-container space-y-10">
        <h1 className="text-3xl font-bold">
          Driver <span className="gradient-text">Earnings</span>
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Earnings"
            value={`₹${data.total}`}
            icon={IndianRupee}
          />
          <StatCard
            title="Completed Trips"
            value={`${data.completedTrips}`}
            icon={TrendingUp}
          />
        </div>

        {/* ================= CHART ================= */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">
            Daily Earnings
          </h2>

          {data.daily.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No earnings data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.daily}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.15}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    })
                  }
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [
                    `₹${value}`,
                    "Earnings"
                  ]}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string;
  icon: any;
}) => (
  <div className="glass-card p-6 flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
      <Icon className="h-6 w-6 text-primary" />
    </div>
  </div>
);

export default DriverEarnings;