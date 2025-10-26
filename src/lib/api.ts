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
   if (!analyticsData || analyticsData.length < days * 2) return "+0%";
  
  const sortedData = [...analyticsData].sort((a, b) => {
    const dateA = new Date(a.aotDate.split('/').reverse().join('-'));
    const dateB = new Date(b.aotDate.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });
  
  // Get the most recent 'days' worth of data
  const currentPeriodData = sortedData.slice(-days);
  
  // Get the previous 'days' worth of data (the period before current)
  const previousPeriodData = sortedData.slice(-days * 2, -days);
  
  if (currentPeriodData.length === 0 || previousPeriodData.length === 0) {
    return "+0%";
  }
  
  // Sum the metric for current period
  const currentTotal = currentPeriodData.reduce((sum, item) => 
    sum + (Number(item[metric]) || 0), 0
  );
  
  // Sum the metric for previous period
  const previousTotal = previousPeriodData.reduce((sum, item) => 
    sum + (Number(item[metric]) || 0), 0
  );
  
  if (previousTotal === 0) {
    return currentTotal > 0 ? "+100%" : "+0%";
  }
  
  const percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
  const sign = percentageChange >= 0 ? "+" : "";
  
  return `${sign}${percentageChange.toFixed(1)}%`;
};
