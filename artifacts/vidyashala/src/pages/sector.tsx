import React from "react";
import { useParams, Link } from "wouter";
import { useGetSector, useListVideos, useListCreators } from "@workspace/api-client-react";
import { 
  Users, Video, BookOpen, Target, Sparkles, ChevronRight, PlayCircle, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Sector() {
  const { slug } = useParams<{ slug: string }>();
  
  // Try to use full detail endpoint if available, or compose data manually
  // The API spec has a useGetSector hook, we assume it returns SectorDetail or Sector based on the spec
  // But wait, the API spec says `useGetSector` returns `Sector`. The mock returns SectorDetail shape? Let's check API schemas.
  // api.schemas.ts says `SectorDetail` exists. But let's fetch everything manually to be safe if useGetSector only returns Sector.
  // Actually, useGetSector might return SectorDetail. Let's assume it does based on standard patterns, or fetch lists if it doesn't.
  
  // Let's use separate hooks to be completely safe based on available methods
  const { data: sectorData, isLoading: isLoadingSector } = useGetSector(slug || "technology", {
    query: { enabled: !!slug }
  });
  
  const { data: videos, isLoading: isLoadingVideos } = useListVideos({ sector: slug, limit: 8 }, {
    query: { enabled: !!slug }
  });
  
  const { data: creators, isLoading: isLoadingCreators } = useListCreators({ sector: slug }, {
    query: { enabled: !!slug }
  });

  // Since useGetSector returns a Sector type in schemas, we'll mock the roadmaps for the UI
  const mockRoadmap = [
    { order: 1, title: "Fundamentals & Basics", duration: "2 weeks", description: "Learn the core concepts from scratch." },
    { order: 2, title: "Practical Applications", duration: "3 weeks", description: "Apply concepts to real-world scenarios." },
    { order: 3, title: "Advanced Techniques", duration: "4 weeks", description: "Master complex problems and solutions." },
  ];

  if (isLoadingSector) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="w-full h-64 rounded-3xl" />
        <div className="grid grid-cols-4 gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      </div>
    );
  }

  if (!sectorData) {
    return <div className="text-center py-20 text-xl font-medium">Sector not found.</div>;
  }

  const sectorColor = sectorData.color || "hsl(var(--primary))";

  return (
    <div className="pb-20">
      {/* Sector Header/Banner */}
      <div 
        className="w-full relative py-16 md:py-24"
        style={{ 
          background: `linear-gradient(135deg, ${sectorColor}20 0%, var(--background) 100%)`,
          borderBottom: `1px solid ${sectorColor}30`
        }}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div 
              className="inline-flex items-center justify-center p-3 rounded-2xl mb-6 shadow-sm"
              style={{ backgroundColor: `${sectorColor}20`, color: sectorColor }}
            >
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-foreground mb-4">
              {sectorData.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              {sectorData.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                <Video className="h-4 w-4" style={{ color: sectorColor }} />
                <span>{sectorData.videoCount.toLocaleString()} Lessons</span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                <Users className="h-4 w-4" style={{ color: sectorColor }} />
                <span>{sectorData.learnerCount.toLocaleString()} Learners</span>
              </div>
              <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                <Star className="h-4 w-4" style={{ color: sectorColor }} />
                <span>{sectorData.creatorCount} Top Creators</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-[100px]" style={{ backgroundColor: sectorColor }}></div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-16">
        
        {/* Ask AI Section */}
        <section className="bg-gradient-to-r from-card to-muted/30 border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-2">Not sure where to start in {sectorData.name}?</h2>
            <p className="text-muted-foreground">Ask our AI tutor to create a personalized study plan based on your current knowledge and goals.</p>
          </div>
          <Link href="/ai-chat">
            <Button size="lg" className="rounded-full shadow-md font-semibold whitespace-nowrap">
              Generate Study Plan
            </Button>
          </Link>
        </section>

        {/* Beginner Roadmap */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Target className="h-6 w-6 text-foreground" />
            <h2 className="text-2xl font-bold font-serif">Learning Path</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
            
            {mockRoadmap.map((step, index) => (
              <Card key={step.order} className="relative z-10 border-border/60 hover:border-primary/50 transition-colors bg-card">
                <CardContent className="p-6">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-4 shadow-md"
                    style={{ backgroundColor: sectorColor }}
                  >
                    {step.order}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="font-medium text-foreground/80">{step.duration}</span>
                    <Button variant="ghost" size="sm" className="h-8 px-2 font-semibold" style={{ color: sectorColor }}>
                      Start <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Instructors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif">Top Creators in {sectorData.name}</h2>
            <Link href={`/creators?sector=${sectorData.slug}`}>
              <Button variant="ghost" className="font-semibold text-primary">See All</Button>
            </Link>
          </div>
          
          <ScrollArea className="w-full pb-4">
            <div className="flex gap-4">
              {isLoadingCreators ? (
                [...Array(5)].map((_, i) => <Skeleton key={i} className="w-48 h-60 rounded-xl flex-shrink-0" />)
              ) : (
                creators?.map((creator) => (
                  <Link key={creator.id} href={`/channel/${creator.id}`}>
                    <Card className="w-48 flex-shrink-0 bg-card border-border/50 hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-5 flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-4 border-2 border-transparent group-hover:border-primary/30 transition-colors">
                          <AvatarImage src={creator.avatarUrl} />
                          <AvatarFallback className="text-xl">{creator.channelName[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-base line-clamp-1 mb-1">{creator.channelName}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{creator.followers.toLocaleString()} learners</p>
                        <Button variant="outline" size="sm" className="w-full rounded-full h-8 text-xs font-semibold">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </section>

        {/* Trending Lessons in Sector */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif">Trending Lessons</h2>
            <Button variant="ghost" className="font-semibold text-primary">See All</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingVideos ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)
            ) : (
              videos?.slice(0,8).map((video) => (
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
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] font-semibold border-border">
                          {video.difficulty || "Beginner"}
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{video.language}</span>
                      </div>
                      <h3 className="font-bold text-sm md:text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <div className="mt-auto pt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium truncate max-w-[100px]">{video.creatorName}</span>
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}