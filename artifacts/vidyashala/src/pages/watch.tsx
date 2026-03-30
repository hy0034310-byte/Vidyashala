import React, { useState } from "react";
import { useParams } from "wouter";
import { useGetVideo, useLikeVideo, useSaveVideo } from "@workspace/api-client-react";
import { 
  Play, ThumbsUp, Share2, Bookmark, Download, MessageSquare, 
  ChevronDown, BookOpen, BrainCircuit, CheckCircle2, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const videoId = parseInt(id || "1", 10);
  
  const { data: video, isLoading } = useGetVideo(videoId, {
    query: { enabled: !!videoId, queryKey: ["/api/videos", videoId] }
  });

  const likeMutation = useLikeVideo();
  const saveMutation = useSaveVideo();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(video?.likes || 0);

  // Update local state when video loads
  React.useEffect(() => {
    if (video) {
      setLikesCount(video.likes);
    }
  }, [video]);

  const handleLike = () => {
    if (!video) return;
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    likeMutation.mutate({ id: videoId });
  };

  const handleSave = () => {
    if (!video) return;
    setIsSaved(!isSaved);
    saveMutation.mutate({ id: videoId });
  };

  if (isLoading || !video) {
    return (
      <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-4">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="w-3/4 h-8" />
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
            <Skeleton className="w-24 h-10 rounded-full" />
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <Skeleton className="w-full h-[600px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
      
      {/* Main Content Area */}
      <div className="w-full lg:w-[68%] xl:w-[72%] space-y-6">
        
        {/* Video Player Placeholder */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl group">
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button size="icon" className="h-20 w-20 rounded-full bg-primary/90 text-primary-foreground hover:scale-110 transition-transform shadow-2xl backdrop-blur-sm">
              <Play className="h-10 w-10 ml-2" fill="currentColor" />
            </Button>
          </div>
          
          {/* Mock Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
              <div className="h-full bg-primary w-1/3"></div>
            </div>
            <div className="flex items-center justify-between text-white text-sm font-medium">
              <div className="flex items-center gap-4">
                <Play className="h-5 w-5 fill-current cursor-pointer hover:text-primary" />
                <span>12:04 / {video.duration}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="border border-white/50 px-1 rounded text-xs">CC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className="bg-secondary text-secondary-foreground">{video.sector}</Badge>
            <Badge variant="outline" className="uppercase font-semibold">{video.language}</Badge>
            {video.difficulty && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground">{video.difficulty}</Badge>
            )}
            {video.tags?.map(tag => (
              <span key={tag} className="text-xs text-muted-foreground font-medium">#{tag}</span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground leading-tight">
            {video.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            {/* Creator Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={video.creatorAvatar} />
                <AvatarFallback>{video.creatorName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-base">{video.creatorName}</h3>
                  {video.isVerified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">124K Learners</p>
              </div>
              <Button className="ml-4 rounded-full px-6 font-semibold" variant="default">
                Subscribe
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <div className="flex items-center bg-muted/50 rounded-full border border-border/50">
                <Button 
                  variant="ghost" 
                  className={`rounded-l-full px-4 font-medium hover:bg-muted ${isLiked ? 'text-primary' : ''}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                  {likesCount.toLocaleString()}
                </Button>
                <div className="w-px h-6 bg-border"></div>
                <Button variant="ghost" className="rounded-r-full px-4 hover:bg-muted">
                  <ThumbsUp className="h-4 w-4 rotate-180" />
                </Button>
              </div>

              <Button variant="secondary" className="rounded-full bg-muted/50 border border-border/50 font-medium">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>

              <Button 
                variant="secondary" 
                className={`rounded-full border border-border/50 font-medium ${isSaved ? 'bg-primary/10 text-primary' : 'bg-muted/50'}`}
                onClick={handleSave}
              >
                <Bookmark className="mr-2 h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <span>{video.views.toLocaleString()} views</span>
            <span>•</span>
            <span>{new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
            {video.description || "In this lesson, we explore the fundamental concepts you need to master this topic. We'll cover practical examples, common pitfalls, and real-world applications that you can use immediately in your career or studies."}
          </p>
          <Button variant="link" className="px-0 mt-2 h-auto text-primary font-semibold">Show more</Button>
        </div>

        {/* Comments Section */}
        <div className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold font-serif">Discussion</h2>
            <span className="text-muted-foreground font-medium">342 Comments</span>
          </div>
          <div className="flex gap-4 mb-8">
            <Avatar className="h-10 w-10">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Add a public comment or ask a question..." 
                className="w-full bg-transparent border-b border-border/60 pb-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <div className="flex justify-end mt-2 hidden">
                <Button size="sm" className="rounded-full">Comment</Button>
              </div>
            </div>
          </div>
          {/* Mock Comment */}
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Rahul Singh</span>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              <p className="text-sm">This was exactly what I needed for my college project! The explanation of the core concepts was so much clearer than my textbook. Will you make a part 2?</p>
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                  <ThumbsUp className="h-3 w-3" /> 24
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                  <MessageSquare className="h-3 w-3" /> Reply
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Area */}
      <div className="w-full lg:w-[32%] xl:w-[28%] flex flex-col gap-6">
        
        {/* Learning Resources Card */}
        <Card className="border-border/60 shadow-sm overflow-hidden bg-gradient-to-b from-card to-muted/20">
          <div className="bg-primary/10 px-4 py-3 border-b border-primary/20 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-primary font-serif">Study Materials</h3>
          </div>
          <CardContent className="p-0">
            <div className="flex flex-col divide-y divide-border/50">
              {video.hasNotes && (
                <div className="p-4 hover:bg-muted/50 flex items-center justify-between group cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Lesson Notes</p>
                      <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              )}
              
              {video.hasFlashcards && (
                <div className="p-4 hover:bg-muted/50 flex items-center justify-between group cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                      <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Smart Flashcards</p>
                      <p className="text-xs text-muted-foreground">12 Terms to memorize</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              )}
            </div>
            
            {video.hasQuiz && (
              <div className="p-4 bg-muted/30 mt-2 mx-4 mb-4 rounded-xl border border-border/50 text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2 text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-sm">Test Your Knowledge</h4>
                <p className="text-xs text-muted-foreground px-2">Take a quick quiz to earn XP and verify what you've learned.</p>
                <Button className="w-full rounded-full font-semibold mt-2" size="sm">
                  Start Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Chapters */}
        <Card className="border-border/60 shadow-sm flex flex-col h-[400px]">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-bold font-serif">Course Content</h3>
            <span className="text-xs font-medium text-muted-foreground">5 Lessons</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col p-2">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${idx === 1 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'}`}
                >
                  <div className={`mt-0.5 text-xs font-bold w-4 ${idx === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {idx === 1 ? <Play className="h-3 w-3 fill-primary text-primary" /> : idx}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold line-clamp-2 ${idx === 1 ? 'text-primary' : 'text-foreground'}`}>
                      {idx === 1 ? video.title : `Module ${idx}: Advanced techniques and principles`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">10:45</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

      </div>
    </div>
  );
}