import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AnalyticsOverTime } from "@/lib/api";
import { format, parse, isValid, subDays } from "date-fns";

interface TotalEngagementChartProps {
  data: AnalyticsOverTime[];
  timeRange: number;
}

export const TotalEngagementChart = ({ data, timeRange }: TotalEngagementChartProps) => {
  // Generate array of dates for the selected time range
  const today = new Date();
  const dateMap = new Map<string, number>();
  
  // Initialize all dates with 0
  for (let i = timeRange - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, "dd/MM/yyyy");
    dateMap.set(dateKey, 0);
  }
  
  // Fill in actual data (only for dates within the time range)
  (Array.isArray(data) ? data : []).forEach(item => {
    if (!item.aotDate) return;
    const parsed = parse(item.aotDate, "dd/MM/yyyy", new Date());
    if (!isValid(parsed)) return;
    
    const dateKey = item.aotDate;
    // Only include data if it exists in our date range
    if (!dateMap.has(dateKey)) return;
    
    const totalEngagement = 
      (Number(item.aotTotalViews) || 0) +
      (Number(item.aotTotalLikes) || 0) + 
      (Number(item.aotTotalComments) || 0) + 
      (Number(item.aotTotalShares) || 0);
    
    dateMap.set(dateKey, totalEngagement);
  });
  
  // Convert to chart data
  const chartData = Array.from(dateMap.entries()).map(([dateStr, total]) => {
    const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
    return {
      date: format(parsed, "MMM dd"),
      total,
    };
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Total Account Engagement</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${value} engagements`, 'Total']}
          />
          <Bar 
            dataKey="total" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
