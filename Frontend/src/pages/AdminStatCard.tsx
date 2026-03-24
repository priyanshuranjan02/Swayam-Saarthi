import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  prefix?: string;
}

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  prefix,
}: AdminStatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex items-center gap-4"
    >
      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">
          {prefix}
          {value}
        </p>
      </div>
    </motion.div>
  );
};

export default AdminStatCard;