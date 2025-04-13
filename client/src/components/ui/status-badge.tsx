import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export function StatusBadge({ 
  status, 
  variant = 'success'
}: StatusBadgeProps) {
  const variantClasses = {
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info"
  };

  const dotClasses = {
    success: "bg-success",
    error: "bg-error",
    warning: "bg-warning",
    info: "bg-info"
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
      variantClasses[variant]
    )}>
      <span className={cn("mr-1 h-1.5 w-1.5 rounded-full", dotClasses[variant])}></span>
      {status}
    </span>
  );
}
