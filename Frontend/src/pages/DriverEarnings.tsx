import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import api from "@/lib/api";
import { Loader2, IndianRupee, TrendingUp, BarChart3 } from "lucide-react";
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

  const averagePerTrip =
    data.completedTrips > 0 ? Math.round(data.total / data.completedTrips) : 0;

  return (
    <PageLayout>
      <div className="page-container space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Driver <span className="gradient-text">Earnings</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your income and completed trips over time
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Earnings"
            value={`₹${data.total}`}
            icon={IndianRupee}
            accent="text-success"
            chip="bg-success/15"
          />
          <StatCard
            title="Completed Trips"
            value={`${data.completedTrips}`}
            icon={TrendingUp}
            accent="text-primary"
            chip="bg-primary/15"
          />
          <StatCard
            title="Avg. Per Trip"
            value={`₹${averagePerTrip}`}
            icon={BarChart3}
            accent="text-accent"
            chip="bg-accent/15"
          />
        </div>

        {/* ================= CHART ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Daily Earnings
            </h2>
            <p className="text-sm text-muted-foreground">
              Your earnings breakdown by day
            </p>
          </div>

          {data.daily.length === 0 ? (
            <div className="flex flex-col items-center text-center gap-3 py-12">
              <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                No earnings data available yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.daily}>
                <defs>
                  <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    })
                  }
                />
                <YAxis
                  allowDecimals={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--secondary) / 0.5)" }}
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    color: "hsl(var(--popover-foreground))",
                    boxShadow: "var(--shadow-md)",
                  }}
                  formatter={(value: number) => [
                    `₹${value}`,
                    "Earnings"
                  ]}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#earningsFill)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({
  title,
  value,
  icon: Icon,
  accent,
  chip
}: {
  title: string;
  value: string;
  icon: any;
  accent: string;
  chip: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card-hover p-6 flex items-center justify-between"
  >
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
    <div className={`h-12 w-12 rounded-xl ${chip} flex items-center justify-center shrink-0`}>
      <Icon className={`h-6 w-6 ${accent}`} />
    </div>
  </motion.div>
);

export default DriverEarnings;
