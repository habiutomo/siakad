import React from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  value,
  icon,
  iconBgColor = "bg-primary/10",
  trend,
  children,
}: DashboardCardProps) {
  return (
    <Card className="shadow-sm border border-neutral-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <p className={cn(
                "text-xs flex items-center mt-1",
                trend.direction === 'up' && "text-success",
                trend.direction === 'down' && "text-error",
                trend.direction === 'neutral' && "text-neutral-500"
              )}>
                {trend.direction === 'up' && <i className="ri-arrow-up-line mr-1"></i>}
                {trend.direction === 'down' && <i className="ri-arrow-down-line mr-1"></i>}
                <span>{trend.value}</span>
              </p>
            )}
            {children}
          </div>
          <div className={cn("p-2 rounded-lg", iconBgColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
