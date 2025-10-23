import { StatsCard } from "@/components/StatsCard";
import { PostCard } from "@/components/PostCard";
import { EngagementChart } from "@/components/EngagementChart";
import { TotalEngagementChart } from "@/components/TotalEngagementChart";
import { fetchPosts, getStats, fetchAnalyticsOverTime, calculatePercentageIncrease } from "@/lib/api";
import { formatNumber } from "@/lib/formatNumber";
import { FileText, Eye, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import profileImg from "@/assets/profile.png";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [timeRange, setTimeRange] = useState<number>(7);

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    refetchInterval: 60000, // Auto-refresh every minute
  });

  const { data: analytics = [], isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalyticsOverTime,
    refetchInterval: 60000, // Auto-refresh every minute
  });

  const safePosts = Array.isArray(posts) ? posts : [];
  const safeAnalytics = Array.isArray(analytics) ? analytics : [];
  const stats = getStats(safePosts);
  const postedPosts = safePosts.filter(p => p.isPosted);
  const upcomingPosts = safePosts.filter(p => !p.isPosted);

  // Calculate percentage increases based on selected time range
  const postsTrend = calculatePercentageIncrease(safeAnalytics, timeRange, 'aotTotalPosts');
  const viewsTrend = calculatePercentageIncrease(safeAnalytics, timeRange, 'aotTotalViews');
  const likesTrend = calculatePercentageIncrease(safeAnalytics, timeRange, 'aotTotalLikes');
  const commentsTrend = calculatePercentageIncrease(safeAnalytics, timeRange, 'aotTotalComments');
  const sharesTrend = calculatePercentageIncrease(safeAnalytics, timeRange, 'aotTotalShares');

  const handlePostToX = async () => {
    try {
      const response = await fetch('https://autodidactic-susannah-unsuperiorly.ngrok-free.dev/webhook/cb65d63b-dabf-4619-a0d5-8dc4b0b3e1a4', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger post');
      }
      
      toast({
        title: "Success!",
        description: "Post workflow triggered successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger post workflow",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isAnalyticsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load data from N8N webhook</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={profileImg} alt="DailyWordX" className="w-16 h-16 rounded-full" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">DailyWordX Analytics</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automated vocabulary expansion on X
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(Number(value))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="180">Last 180 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handlePostToX} className="gap-2">
                  Post to X
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-6 overflow-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCard
              title="Total Posts"
              value={formatNumber(stats.totalPosts)}
              icon={FileText}
              trend={postsTrend}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-500"
            />
            <StatsCard
              title="Total Views"
              value={formatNumber(stats.totalViews)}
              icon={Eye}
              trend={viewsTrend}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-500"
            />
            <StatsCard
              title="Total Likes"
              value={formatNumber(stats.totalLikes)}
              icon={Heart}
              trend={likesTrend}
              iconBgColor="bg-red-50"
              iconColor="text-red-500"
            />
            <StatsCard
              title="Total Comments"
              value={formatNumber(stats.totalComments)}
              icon={MessageCircle}
              trend={commentsTrend}
              iconBgColor="bg-green-50"
              iconColor="text-green-500"
            />
            <StatsCard
              title="Total Shares"
              value={formatNumber(stats.totalShares)}
              icon={Share2}
              trend={sharesTrend}
              iconBgColor="bg-orange-50"
              iconColor="text-orange-500"
            />
          </div>

          {/* Engagement Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <EngagementChart data={safeAnalytics} timeRange={timeRange} />
            <TotalEngagementChart data={safeAnalytics} timeRange={timeRange} />
          </div>

          {/* Posts Tabs */}
          <Tabs defaultValue="posted" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="posted">
                Posted ({postedPosts.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingPosts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posted" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Posted Content</h2>
                <p className="text-sm text-muted-foreground">
                  All your published vocabulary posts with engagement metrics
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {postedPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Upcoming Posts</h2>
                <p className="text-sm text-muted-foreground">
                  Scheduled vocabulary posts ready to be published
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
