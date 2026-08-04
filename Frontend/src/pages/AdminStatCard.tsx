import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  prefix?: string;
  subtitle?: string;
}

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  prefix,
  subtitle,
}: AdminStatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="glass-card p-6 transition-all duration-300 hover:border-primary/30"
    >
      <div className="flex items-center justify-between mb-5">

        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>

      </div>

      <div>

        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-1">
          {prefix}
          {value}
        </h2>

        {subtitle && (
          <p className="text-sm text-primary font-medium mt-3">
            {subtitle}
          </p>
        )}

      </div>

    </motion.div>
  );
};

export default AdminStatCard;