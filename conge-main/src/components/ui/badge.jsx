import { cn } from '@/lib/utils';

const Badge = ({ className, variant = 'default', ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
          'border text-foreground': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
};

export { Badge };
