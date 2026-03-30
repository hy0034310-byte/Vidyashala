import React from "react";
import { Link } from "wouter";
import { useGetHomeFeed } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { 
  PlayCircle, 
  TrendingUp, 
  Clock, 
  Award, 
  ChevronRight,
  BookOpen,
  PlaySquare,
  Briefcase,
  Sparkles,
  Flame,
  Zap,
  Users,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const { data: homeFeed, isLoading } = useGetHomeFeed();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8 max-w-7xl mx-auto px-4 md:px-6">
        <Skeleton className="w-full h-12 rounded-full" />
        <div className="space-y-4">
          <Skeleton className="w-48 h-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-10 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* Sector Chips */}
      <section>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-3 pb-4">
            <Button variant="default" className="rounded-full font-semibold">
              All Content
            </Button>
            {homeFeed?.sectors?.map((sector) => (
              <Link key={sector.id} href={`/sector/${sector.slug}`}>
                <Button variant="outline" className="rounded-full bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                  {sector.name}
                </Button>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </section>

      {/* Hero Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="flex-1 space-y-4 relative z-10">
          <Badge className="bg-primary text-primary-foreground font-medium px-3 py-1">Welcome back, Arjun!</Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            Ready to <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">master</span> something new today?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Pick up where you left off in Advanced React, or explore our new Agriculture Tech series.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full font-semibold shadow-md shadow-primary/20">
                <PlayCircle className="mr-2 h-5 w-5" /> Continue Learning
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="rounded-full font-semibold bg-background/50 backdrop-blur-sm">
                Explore Sectors
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex justify-center relative z-10">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop" alt="Student learning" className="relative z-10 rounded-2xl object-cover w-full h-full shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500" />
            <div className="absolute -bottom-4 -left-4 bg-background p-3 rounded-xl shadow-lg flex items-center gap-3 z-20 border border-border">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Daily Streak</p>
                <p className="text-sm font-bold">5 Days!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Lessons */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold font-serif">Trending Lessons</h2>
          </div>
          <Button variant="ghost" className="text-primary font-semibold hidden sm:flex">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {homeFeed?.trendingVideos?.slice(0,4).map((video) => (
            <motion.div key={video.id} variants={item}>
              <Link href={`/watch/${video.id}`}>
                <Card className="overflow-hidden h-full border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-pointer bg-card flex flex-col">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-primary/90 text-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <PlayCircle className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 font-medium text-[10px]">
                        {video.sector}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground uppercase">{video.language}</span>
                    </div>
                    <h3 className="font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarImage src={video.creatorAvatar} />
                          <AvatarFallback>{video.creatorName[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate max-w-[80px]">{video.creatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Top Shorts Strip */}
      <section className="bg-gradient-to-r from-accent/10 to-transparent p-6 rounded-3xl border border-accent/20">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <PlaySquare className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold font-serif">Quick Bites <span className="text-muted-foreground text-lg font-sans font-normal">(Shorts)</span></h2>
          </div>
          <Link href="/shorts">
            <Button variant="ghost" className="text-accent font-semibold hover:text-accent hover:bg-accent/10">
              Watch Feed <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <ScrollArea className="w-full pb-4">
          <div className="flex gap-4">
            {homeFeed?.trendingShorts?.map((short) => (
              <Link key={short.id} href={`/shorts?id=${short.id}`}>
                <div className="relative w-40 sm:w-48 aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer shadow-sm border border-border hover:border-accent/50 transition-colors">
                  <img src={short.thumbnailUrl} alt={short.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="font-semibold text-sm line-clamp-2 leading-tight mb-1">{short.title}</p>
                    <p className="text-xs text-white/70">{short.views.toLocaleString()} views</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden sm:flex" />
        </ScrollArea>
      </section>

      {/* Recommended For You */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-secondary" />
          <h2 className="text-2xl font-bold font-serif">Recommended For You</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {homeFeed?.recommendedVideos?.slice(0,4).map((video) => (
            <Link key={video.id} href={`/watch/${video.id}`}>
              <Card className="overflow-hidden h-full border-border/50 hover:shadow-lg hover:border-secondary/30 transition-all duration-300 group cursor-pointer bg-card flex flex-col">
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
                    <Badge variant="outline" className="text-[10px] font-medium border-secondary/30 text-secondary">
                      {video.sector}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-foreground line-clamp-2 leading-snug group-hover:text-secondary transition-colors">
                    {video.title}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">{video.creatorName}</span>
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}