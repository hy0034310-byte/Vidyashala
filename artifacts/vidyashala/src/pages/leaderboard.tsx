import React from "react";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Trophy, Medal, Star, Flame, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="flex justify-center items-end gap-4 h-64">
          <Skeleton className="w-32 h-40 rounded-t-xl" />
          <Skeleton className="w-40 h-56 rounded-t-xl" />
          <Skeleton className="w-32 h-32 rounded-t-xl" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  const top3 = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  // Sort top 3 to display as: 2nd, 1st, 3rd for podium layout
  const podiumData = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground">
          Top Scholars
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Compete with learners across India. Earn XP by taking quizzes and completing courses.
        </p>
      </div>

      {/* Podium Section */}
      <div className="flex justify-center items-end gap-2 md:gap-6 pt-10 pb-6 mt-8">
        {podiumData.map((user, idx) => {
          // idx 0 is 2nd place, idx 1 is 1st place, idx 2 is 3rd place
          const isFirst = idx === 1;
          const isSecond = idx === 0;
          const isThird = idx === 2;
          
          const rank = isFirst ? 1 : isSecond ? 2 : 3;
          const heightClass = isFirst ? 'h-56 md:h-64' : isSecond ? 'h-44 md:h-52' : 'h-36 md:h-40';
          const bgClass = isFirst 
            ? 'bg-gradient-to-t from-yellow-500/20 to-yellow-200 border-yellow-400 dark:from-yellow-900/50 dark:to-yellow-700/50' 
            : isSecond 
              ? 'bg-gradient-to-t from-slate-300/40 to-slate-200 border-slate-300 dark:from-slate-800/50 dark:to-slate-700/50'
              : 'bg-gradient-to-t from-orange-400/20 to-orange-200 border-orange-300 dark:from-orange-950/50 dark:to-orange-900/50';

          return (
            <motion.div 
              key={user.rank}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center relative w-24 md:w-40"
            >
              <div className="relative mb-3">
                {isFirst && <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-500 h-8 w-8 drop-shadow-md z-10" fill="currentColor" />}
                <Avatar className={`border-4 shadow-xl z-0 ${isFirst ? 'h-20 w-20 md:h-24 md:w-24 border-yellow-400' : isSecond ? 'h-16 w-16 md:h-20 md:w-20 border-slate-300' : 'h-14 w-14 md:h-16 md:w-16 border-orange-300'}`}>
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.userName[0]}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-background z-10 ${isFirst ? 'bg-yellow-500' : isSecond ? 'bg-slate-400' : 'bg-orange-500'}`}>
                  {rank}
                </div>
              </div>
              
              <div className={`w-full rounded-t-2xl border-t border-l border-r flex flex-col items-center justify-start pt-6 px-2 text-center shadow-inner ${heightClass} ${bgClass}`}>
                <p className="font-bold text-sm md:text-base line-clamp-1">{user.userName}</p>
                <p className="text-xs md:text-sm font-semibold text-foreground/70 mt-1">{user.score.toLocaleString()} XP</p>
                
                {isFirst && (
                  <Badge className="mt-auto mb-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 border border-yellow-300 font-bold">
                    {user.badge}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of the list */}
      <div className="max-w-3xl mx-auto space-y-3">
        {rest.map((user, idx) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (idx * 0.05) }}
          >
            <Card className="border-border hover:border-primary/30 hover:bg-muted/20 transition-colors shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-8 text-center font-bold text-muted-foreground text-lg">
                  {user.rank}
                </div>
                
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.userName[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">{user.userName}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {user.quizzesTaken} Quizzes</span>
                    <span className="flex items-center gap-1 text-orange-500"><Flame className="h-3 w-3" /> {user.streak} Day Streak</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">{user.score.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase">XP</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  );
}