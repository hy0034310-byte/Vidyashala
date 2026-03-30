import React from "react";
import { Link } from "wouter";
import { useGetUserDashboard } from "@workspace/api-client-react";
import { Flame, Target, BookOpen, Clock, Award, PlayCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetUserDashboard();

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!dashboard) return null;

  const { user, continueWatching, weeklyStreak, xpProgress, xpToNextLevel, currentLevel } = dashboard;

  // Days of week for streak
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Welcome & Streak Banner */}
      <section className="bg-gradient-to-r from-card to-orange-50 border border-border/60 dark:from-card dark:to-orange-950/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center border-4 border-orange-200 dark:border-orange-800">
              <Flame className="h-10 w-10 text-orange-500 fill-orange-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-background border border-border font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
              {user.streak}
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif mb-1">You're on fire, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground font-medium">{user.streak} day learning streak. Keep it up!</p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 bg-background/60 p-3 rounded-2xl backdrop-blur-sm border border-border">
          {weeklyStreak.map((isCompleted, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isCompleted ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-muted text-muted-foreground'}`}>
                {isCompleted ? <CheckIcon /> : days[i]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats & Level */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Level Card */}
        <Card className="md:col-span-5 bg-card border-border/60 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
          <CardContent className="p-6 md:p-8 h-full flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Level</p>
                <h2 className="text-3xl font-bold font-serif text-primary">{currentLevel}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.totalXP.toLocaleString()} XP</p>
              </div>
            </div>
            
            <div className="space-y-2 mt-2">
              <Progress value={xpProgress} className="h-3 bg-muted" />
              <p className="text-xs font-medium text-muted-foreground text-right">
                {xpToNextLevel} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mini Stats */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border/60 shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex flex-col items-center justify-center h-full text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-3">
                <PlayCircle className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{dashboard.videosWatched}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Lessons</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/60 shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-5 flex flex-col items-center justify-center h-full text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{dashboard.minutesLearned}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Minutes</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/60 shadow-sm hover:border-primary/30 transition-colors col-span-2 sm:col-span-1">
            <CardContent className="p-5 flex flex-col items-center justify-center h-full text-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-3">
                <Target className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{dashboard.quizzesTaken}</p>
              <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Quizzes</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" /> Continue Learning
            </h2>
          </div>
          
          <ScrollArea className="w-full pb-4">
            <div className="flex gap-6">
              {continueWatching.map((item) => (
                <Link key={item.video.id} href={`/watch/${item.video.id}`}>
                  <Card className="w-72 sm:w-80 flex-shrink-0 bg-card border-border/60 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer overflow-hidden">
                    <div className="relative aspect-video w-full">
                      <img src={item.video.thumbnailUrl} alt={item.video.title} className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                      {/* Progress Bar overlay on thumbnail */}
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40 backdrop-blur-sm">
                        <div className="h-full bg-primary" style={{ width: `${item.progressPercent}%` }}></div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2 text-[10px]">{item.video.sector}</Badge>
                      <h3 className="font-bold text-sm line-clamp-2 leading-snug mb-2">{item.video.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.progressPercent}% Completed</span>
                        <span>{item.video.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      )}

      {/* Recent Badges */}
      <section>
        <h2 className="text-2xl font-bold font-serif flex items-center gap-2 mb-6">
          <Award className="h-6 w-6 text-yellow-500" /> Recent Achievements
        </h2>
        <div className="flex flex-wrap gap-4">
          {dashboard.recentBadges.map((badge, idx) => (
            <div key={idx} className="bg-card border border-border/60 rounded-2xl p-4 flex items-center gap-4 w-full sm:w-auto min-w-[200px] shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center border border-yellow-200 dark:border-yellow-800">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div>
                <p className="font-bold text-sm">{badge}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Earned this week</p>
              </div>
            </div>
          ))}
          <div className="bg-muted/30 border border-dashed border-border/80 rounded-2xl p-4 flex items-center justify-center w-full sm:w-auto min-w-[200px] cursor-pointer hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium text-muted-foreground">View all badges <ChevronRight className="inline h-4 w-4" /></span>
          </div>
        </div>
      </section>

    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}