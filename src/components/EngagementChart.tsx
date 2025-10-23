import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AnalyticsOverTime } from "@/lib/api";
import { format, parse, isValid, subDays } from "date-fns";

interface EngagementChartProps {
  data: AnalyticsOverTime[];
  timeRange: number;
}

export const EngagementChart = ({ data, timeRange }: EngagementChartProps) => {
  // Generate array of dates for the selected time range
  const today = new Date();
  const dateMap = new Map<string, { likes: number; comments: number; shares: number }>();
  
  // Initialize all dates with 0
  for (let i = timeRange - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateKey = format(date, "dd/MM/yyyy");
    dateMap.set(dateKey, { likes: 0, comments: 0, shares: 0 });
  }
  
  // Fill in actual data (only for dates within the time range)
  (Array.isArray(data) ? data : []).forEach(item => {
    if (!item.aotDate) return;
    const parsed = parse(item.aotDate, "dd/MM/yyyy", new Date());
    if (!isValid(parsed)) return;
    
    const dateKey = item.aotDate;
    // Only include data if it exists in our date range
    if (!dateMap.has(dateKey)) return;
    
    dateMap.set(dateKey, {
      likes: Number(item.aotTotalLikes) || 0,
      comments: Number(item.aotTotalComments) || 0,
      shares: Number(item.aotTotalShares) || 0,
    });
  });
  
  // Convert to chart data
  const chartData = Array.from(dateMap.entries()).map(([dateStr, values]) => {
    const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
    return {
      date: format(parsed, "MMM dd"),
      ...values,
    };
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Engagement Over Time</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
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
          />
          <Legend 
            wrapperStyle={{
              fontSize: '12px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="likes" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Likes"
            dot={{ fill: '#ef4444', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="comments" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Comments"
            dot={{ fill: '#f59e0b', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="shares" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Shares"
            dot={{ fill: '#10b981', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
