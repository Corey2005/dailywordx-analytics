import { Post } from "./mockData";

const WEBHOOK_URL = "https://autodidactic-susannah-unsuperiorly.ngrok-free.dev/webhook/cf3606c2-07c6-43d6-a878-16969eee071b";
const ANALYTICS_WEBHOOK_URL = "https://autodidactic-susannah-unsuperiorly.ngrok-free.dev/webhook/99ecac1c-78c5-4d5e-8582-02e549b5808e";

export interface AnalyticsOverTime {
  aotDate: string;
  aotTotalPosts: number;
  aotTotalViews: number;
  aotTotalLikes: number;
  aotTotalComments: number;
  aotTotalShares: number;
}

export const fetchAnalyticsOverTime = async (): Promise<AnalyticsOverTime[]> => {
  const response = await fetch(ANALYTICS_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch analytics from N8N webhook");
  }
  
  const data = await response.json();
  
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.analytics)) {
    return data.analytics;
  } else if (data && Array.isArray(data.data)) {
    return data.data;
  }
  
  console.error("Unexpected analytics webhook response format:", data);
  return [];
};

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch posts from N8N webhook");
  }
  
  const data = await response.json();
  
  // Handle different response formats - ensure we always return an array
  if (Array.isArray(data)) {
    return data;
  } else if (data && Array.isArray(data.posts)) {
    return data.posts;
  } else if (data && Array.isArray(data.data)) {
    return data.data;
  }
  
  // If data format is unexpected, return empty array to prevent crashes
  console.error("Unexpected webhook response format:", data);
  return [];
};

export const getStats = (posts: Post[]) => {
  // Ensure posts is an array before filtering
  if (!Array.isArray(posts)) {
    console.error("getStats received non-array:", posts);
    return {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
    };
  }
  
  const postedPosts = posts.filter(p => p.isPosted);
  
  return {
    totalPosts: postedPosts.length,
    totalViews: postedPosts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: postedPosts.reduce((sum, post) => sum + post.likes, 0),
    totalComments: postedPosts.reduce((sum, post) => sum + post.comments, 0),
    totalShares: postedPosts.reduce((sum, post) => sum + post.shares, 0),
  };
};

export const calculatePercentageIncrease = (
  analyticsData: AnalyticsOverTime[],
  days: number,
  metric: keyof Pick<AnalyticsOverTime, 'aotTotalPosts' | 'aotTotalViews' | 'aotTotalLikes' | 'aotTotalComments' | 'aotTotalShares'>
): string => {
  if (!analyticsData || analyticsData.length < 2) return "+0%";
  
  const sortedData = [...analyticsData].sort((a, b) => 
    new Date(a.aotDate).getTime() - new Date(b.aotDate).getTime()
  );
  
  const latestData = sortedData[sortedData.length - 1];
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);
  
  const historicalData = sortedData.filter(d => 
    new Date(d.aotDate) <= targetDate
  );
  
  if (historicalData.length === 0) {
    return "+0%";
  }
  
  const oldestInRange = historicalData[historicalData.length - 1];
  const oldValue = oldestInRange[metric];
  const newValue = latestData[metric];
  
  if (oldValue === 0) return "+100%";
  
  const percentageChange = ((newValue - oldValue) / oldValue) * 100;
  const sign = percentageChange >= 0 ? "+" : "";
  
  return `${sign}${percentageChange.toFixed(1)}%`;
};
