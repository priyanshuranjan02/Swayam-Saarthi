import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface BookingStatus {
  status: string;
  count: number;
}

interface Props {
  data: BookingStatus[];
}

const COLORS = [
  "#22c55e", // completed
  "#eab308", // pending
  "#3b82f6", // ongoing
  "#ef4444", // cancelled
  "#8b5cf6",
];

export default function BookingStatusPieChart({
  data,
}: Props) {
  const chartData = data.map((item) => ({
    ...item,
    status:
      item.status.charAt(0).toUpperCase() +
      item.status.slice(1),
  }));

  return (
    <div className="glass-card p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold">
          Booking Status
        </h2>

        <p className="text-muted-foreground text-sm">
          Distribution of all bookings
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <PieChart>

          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            outerRadius={110}
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}