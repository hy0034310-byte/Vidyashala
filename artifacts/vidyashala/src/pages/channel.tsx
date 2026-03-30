import React from "react";
import { useParams, Link } from "wouter";
import { useGetCreator, useListVideos } from "@workspace/api-client-react";
import { CheckCircle2, MapPin, Globe, PlayCircle, Users, Eye, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Channel() {
  const { id } = useParams<{ id: string }>();
  const creatorId = parseInt(id || "1", 10);

  const { data: creator, isLoading: isLoadingCreator } = useGetCreator(creatorId, {
    query: { enabled: !!creatorId, queryKey: ["/api/creators", creatorId] }
  });

  const { data: videos, isLoading: isLoadingVideos } = useListVideos({ limit: 12 }, {
    // Usually we would filter by creatorId, mocking by using general list for now
  });

  if (isLoadingCreator) {
    return (
      <div className="w-full">
        <Skeleton className="h-48 md:h-64 w-full" />
        <div className="container max-w-7xl mx-auto px-4 pb-12">
          <div className="flex flex-col md:flex-row gap-6 relative -top-12">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
            <div className="pt-14 md:pt-16 flex-1 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) return <div className="text-center py-20">Creator not found</div>;

  return (
    <div className="w-full pb-20">
      
      {/* Banner */}
      <div className="h-48 md:h-72 w-full bg-gradient-to-r from-primary/40 to-secondary/40 relative">
        {creator.bannerUrl && (
          <img src={creator.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
        )}
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative -top-16 md:-top-20">
        
        {/* Profile Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-6 mb-8 bg-background p-4 rounded-3xl shadow-sm border border-border/50">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 w-full md:w-auto">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={creator.avatarUrl} />
              <AvatarFallback className="text-3xl font-serif">{creator.channelName[0]}</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left space-y-2 mt-2 md:mt-0">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-bold font-serif">{creator.channelName}</h1>
                {creator.isVerified && <CheckCircle2 className="h-6 w-6 text-primary" />}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground font-medium">
                <span>{creator.followers.toLocaleString()} Learners</span>
                <span>•</span>
                <span>{creator.videoCount} Lessons</span>
                <span>•</span>
                <span>{creator.totalViews.toLocaleString()} Views</span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">{creator.sector}</Badge>
                {creator.languages.map(lang => (
                  <Badge key={lang} variant="outline" className="border-border/60 uppercase">{lang}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto mt-4 md:mt-0 px-4 md:px-0">
            <Button size="lg" className="w-full md:w-auto rounded-full font-bold px-8 shadow-md">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="w-full justify-start border-b border-border/60 bg-transparent h-auto p-0 rounded-none mb-8 gap-8 overflow-x-auto overflow-y-hidden">
            <TabsTrigger 
              value="lessons" 
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-0 pb-3 font-semibold text-base"
            >
              Lessons
            </TabsTrigger>
            <TabsTrigger 
              value="shorts" 
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-0 pb-3 font-semibold text-base"
            >
              Shorts
            </TabsTrigger>
            <TabsTrigger 
              value="about" 
              className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-0 pb-3 font-semibold text-base"
            >
              About
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lessons" className="mt-0 outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingVideos ? (
                [...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)
              ) : (
                videos?.map((video) => (
                  <Link key={video.id} href={`/watch/${video.id}`}>
                    <Card className="overflow-hidden h-full border-border/50 hover:shadow-md transition-all duration-300 group cursor-pointer bg-card flex flex-col">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md">
                          {video.duration}
                        </div>
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{video.views.toLocaleString()} views</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="shorts" className="mt-0 outline-none">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
               {/* Mock Shorts Grid */}
               {[1,2,3,4,5].map((item) => (
                 <div key={item} className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer border border-border shadow-sm">
                   <img src={`https://images.unsplash.com/photo-${1500000000000 + item}?q=80&w=400&auto=format&fit=crop`} alt="Short" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                     <p className="font-semibold text-sm line-clamp-2">Quick tip for faster learning</p>
                     <p className="text-xs opacity-80 mt-1">12K views</p>
                   </div>
                 </div>
               ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-0 outline-none">
            <Card className="max-w-3xl border-border/50 shadow-sm bg-card">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-serif mb-4">About {creator.channelName}</h3>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">
                    {creator.bio || "Welcome to my channel! I create educational content focused on helping students and professionals upskill. Expect high-quality lessons, practical examples, and clear explanations."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
                  <div className="space-y-4">
                    <h4 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Stats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">{creator.followers.toLocaleString()} Subscribers</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-primary" />
                        <span className="font-medium">{creator.totalViews.toLocaleString()} Total Views</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        <span className="font-medium">{creator.videoCount} Videos Published</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-secondary" />
                        <span className="font-medium">Focus: {creator.sector}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-secondary" />
                        <span className="font-medium">Languages: {creator.languages.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-secondary" />
                        <span className="font-medium">Joined {new Date(creator.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric'})}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}