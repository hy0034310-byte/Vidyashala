import React, { useState } from "react";
import { Link } from "wouter";
import { useListSectors, useGetPlatformStats } from "@workspace/api-client-react";
import { Search, Compass, BookOpen, Users, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Explore() {
  const { data: sectors, isLoading: isLoadingSectors } = useListSectors();
  const { data: stats } = useGetPlatformStats();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSectors = sectors?.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 text-primary">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
          What will you learn today?
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore {stats?.sectorsCount || "many"} specialized sectors tailored for Indian learners. 
          From farming techniques to advanced software engineering.
        </p>
        
        <div className="relative max-w-2xl mx-auto mt-8 shadow-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            className="w-full pl-12 h-14 rounded-full text-base bg-card border-border/60 focus-visible:ring-primary/30"
            placeholder="Search for a sector, topic, or career path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 font-semibold h-10">
            Search
          </Button>
        </div>
      </section>

      {/* Platform Stats */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/50">
            <Video className="h-6 w-6 text-primary mb-2" />
            <span className="text-2xl font-bold font-serif">{stats.totalVideos.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Lessons</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/50">
            <Users className="h-6 w-6 text-secondary mb-2" />
            <span className="text-2xl font-bold font-serif">{stats.totalLearners.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Learners</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/50">
            <BookOpen className="h-6 w-6 text-accent mb-2" />
            <span className="text-2xl font-bold font-serif">{stats.totalCreators.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Creators</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="h-6 w-6 rounded-full bg-chart-4/20 text-chart-4 flex items-center justify-center mb-2 font-bold font-serif text-sm">Aअ</div>
            <span className="text-2xl font-bold font-serif">{stats.languagesSupported}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Languages</span>
          </div>
        </section>
      )}

      {/* Sectors Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-serif">All Learning Sectors</h2>
        </div>

        {isLoadingSectors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSectors?.map((sector) => (
              <motion.div key={sector.id} variants={itemVariants}>
                <Link href={`/sector/${sector.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 cursor-pointer overflow-hidden group bg-card">
                    {/* Top colored strip based on sector color */}
                    <div className="h-2 w-full" style={{ backgroundColor: sector.color }}></div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                          style={{ backgroundColor: `${sector.color}20`, color: sector.color }}
                        >
                          {/* Placeholder icon, in real app use dynamic icon based on iconName */}
                          <BookOpen className="h-7 w-7" />
                        </div>
                        <div className="bg-muted/50 px-3 py-1 rounded-full text-xs font-medium border border-border">
                          {sector.videoCount.toLocaleString()} Videos
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">
                        {sector.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                        {sector.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-auto border-t border-border/50 pt-4 text-sm font-medium">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{sector.learnerCount.toLocaleString()} learners</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Video className="h-4 w-4" />
                          <span>{sector.creatorCount} creators</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
            
            {filteredSectors?.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <p className="text-lg">No sectors found matching "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
              </div>
            )}
          </motion.div>
        )}
      </section>

    </div>
  );
}