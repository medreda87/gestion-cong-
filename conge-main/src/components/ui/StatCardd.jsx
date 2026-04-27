import { motion } from 'framer-motion';

const variantStyles = {
  default: 'bg-card border border-border',
  primary: 'bg-primary/5 border border-primary/20',
  success: 'bg-success/5 border border-success/20',
  warning: 'bg-warning/5 border border-warning/20',
  info: 'bg-info/5 border border-info/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
};

export default function StatCard({
  title,
  value,
  icon,
  variant = 'default',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1 text-foreground">
            {value}
          </p>
        </div>

        <div
          className={`h-11 w-11 rounded-lg flex items-center justify-center ${iconStyles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}