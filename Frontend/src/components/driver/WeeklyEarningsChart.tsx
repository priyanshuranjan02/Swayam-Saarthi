import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EarningsData {
  date: string;
  earnings: number;
}

interface Props {
  data: EarningsData[];
}

export default function WeeklyEarningsChart({
  data,
}: Props) {
  const chartData = data.map((item) => ({
    ...item,
    day: new Date(item.date).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
      }
    ),
  }));

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Weekly Earnings
        </h2>

        <p className="text-muted-foreground text-sm">
          Earnings during the last 7 days
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip
            formatter={(value: number) => [
              `₹${value}`,
              "Earnings",
            ]}
          />

          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}