export interface Post {
  id: string;
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

export const mockPosts: Post[] = [
  {
    id: "1",
    word: "Eloquent",
    wordClass: "Adjective",
    definition: "Fluent or persuasive in speaking or writing.",
    example: "Her eloquent speech moved the entire audience to tears.",
    views: 15234,
    likes: 892,
    comments: 47,
    shares: 156,
    postDate: "2025-10-15",
    isPosted: true,
  },
  {
    id: "2",
    word: "Resilient",
    wordClass: "Adjective",
    definition: "Able to withstand or recover quickly from difficult conditions.",
    example: "The resilient community rebuilt after the natural disaster.",
    views: 12456,
    likes: 743,
    comments: 32,
    shares: 98,
    postDate: "2025-10-14",
    isPosted: true,
  },
  {
    id: "3",
    word: "Serendipity",
    wordClass: "Noun",
    definition: "The occurrence of events by chance in a happy or beneficial way.",
    example: "Finding that vintage book was pure serendipity.",
    views: 18921,
    likes: 1234,
    comments: 89,
    shares: 267,
    postDate: "2025-10-13",
    isPosted: true,
  },
  {
    id: "4",
    word: "Ephemeral",
    wordClass: "Adjective",
    definition: "Lasting for a very short time.",
    example: "The beauty of cherry blossoms is ephemeral but unforgettable.",
    views: 14567,
    likes: 876,
    comments: 54,
    shares: 143,
    postDate: "2025-10-12",
    isPosted: true,
  },
  {
    id: "5",
    word: "Pristine",
    wordClass: "Adjective",
    definition: "In its original condition; unspoiled.",
    example: "The pristine forest remained untouched by civilization.",
    views: 11234,
    likes: 654,
    comments: 28,
    shares: 87,
    postDate: "2025-10-11",
    isPosted: true,
  },
  {
    id: "6",
    word: "Quintessential",
    wordClass: "Adjective",
    definition: "Representing the most perfect or typical example of a quality or class.",
    example: "He was the quintessential gentleman, always polite and considerate.",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    postDate: "2025-10-18",
    isPosted: false,
  },
  {
    id: "7",
    word: "Ubiquitous",
    wordClass: "Adjective",
    definition: "Present, appearing, or found everywhere.",
    example: "Smartphones have become ubiquitous in modern society.",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    postDate: "2025-10-19",
    isPosted: false,
  },
  {
    id: "8",
    word: "Voracious",
    wordClass: "Adjective",
    definition: "Wanting or devouring great quantities of food.",
    example: "She was a voracious reader, finishing several books each week.",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    postDate: "2025-10-20",
    isPosted: false,
  },
];

export const getStats = () => {
  const postedPosts = mockPosts.filter(p => p.isPosted);
  return {
    totalPosts: postedPosts.length,
    totalViews: postedPosts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: postedPosts.reduce((sum, p) => sum + p.likes, 0),
    totalComments: postedPosts.reduce((sum, p) => sum + p.comments, 0),
    totalShares: postedPosts.reduce((sum, p) => sum + p.shares, 0),
  };
};
