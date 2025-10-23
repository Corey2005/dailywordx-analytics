import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary"
}: StatsCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("p-2 rounded-lg", iconBgColor)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
              <span>↑</span>
              {trend}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
