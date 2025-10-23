import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageCircle, Share2, Calendar } from "lucide-react";

interface PostCardProps {
  word: string;
  wordClass: string;
  definition: string;
  example: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postDate: string;
  isPosted: boolean;
}

export const PostCard = ({
  word,
  wordClass,
  definition,
  example,
  views,
  likes,
  comments,
  shares,
  postDate,
  isPosted,
}: PostCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-card-foreground">{word}</h3>
              <Badge variant="secondary" className="text-xs">
                {wordClass}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{definition}</p>
          </div>
          <Badge variant={isPosted ? "default" : "outline"}>
            {isPosted ? "Posted" : "Scheduled"}
          </Badge>
        </div>

        <div className="p-4 bg-secondary rounded-lg border border-border">
          <p className="text-sm italic text-secondary-foreground">"{example}"</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{postDate}</span>
        </div>

        {isPosted && (
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-primary" />
              <span className="font-medium text-card-foreground">{views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-accent" />
              <span className="font-medium text-card-foreground">{likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="font-medium text-card-foreground">{comments.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Share2 className="w-4 h-4 text-accent" />
              <span className="font-medium text-card-foreground">{shares.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
