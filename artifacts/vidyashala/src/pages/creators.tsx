import React, { useState } from "react";
import { Link } from "wouter";
import { useListCreators, useListSectors } from "@workspace/api-client-react";
import { Search, CheckCircle2, Users, Video, Filter, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Creators() {
  const [activeSector, setActiveSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sectors } = useListSectors();
  const { data: creators, isLoading } = useListCreators(
    activeSector !== "all" ? { sector: activeSector } : {}
  );

  const filteredCreators = creators?.filter(c => 
    c.channelName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-serif text-foreground mb-2">Learn from the Best</h1>
          <p className="text-muted-foreground text-lg">Discover passionate educators across India.</p>
        </div>
        <div className="w-full md:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search creators..." 
            className="pl-10 w-full md:w-80 h-12 rounded-full bg-card shadow-sm border-border/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button 
          variant={activeSector === "all" ? "default" : "outline"} 
          className="rounded-full px-6 whitespace-nowrap font-medium"
          onClick={() => setActiveSector("all")}
        >
          All Creators
        </Button>
        {sectors?.map((sector) => (
          <Button 
            key={sector.id}
            variant={activeSector === sector.slug ? "default" : "outline"} 
            className="rounded-full px-6 whitespace-nowrap font-medium bg-card"
            onClick={() => setActiveSector(sector.slug)}
          >
            {sector.name}
          </Button>
        ))}
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(8)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
        ) : filteredCreators?.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No creators found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredCreators?.map((creator) => (
            <Link key={creator.id} href={`/channel/${creator.id}`}>
              <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group bg-card">
                <div className="h-24 w-full bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                  {creator.bannerUrl && <img src={creator.bannerUrl} className="w-full h-full object-cover" alt="Banner" />}
                </div>
                <CardContent className="px-5 pb-5 pt-0 flex flex-col items-center text-center relative">
                  <Avatar className="h-20 w-20 border-4 border-card -mt-10 mb-3 group-hover:scale-105 transition-transform bg-background">
                    <AvatarImage src={creator.avatarUrl} />
                    <AvatarFallback className="text-xl font-serif">{creator.channelName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="font-bold text-lg font-serif">{creator.channelName}</h3>
                    {creator.isVerified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  
                  <Badge variant="secondary" className="mb-3 bg-muted text-muted-foreground font-medium">
                    {creator.sector}
                  </Badge>
                  
                  <p className="text-sm text-foreground/80 line-clamp-2 mb-4 h-10">
                    {creator.bio || "Passionate educator sharing knowledge."}
                  </p>
                  
                  <div className="flex items-center justify-around w-full mt-auto pt-4 border-t border-border/50 text-sm font-medium text-muted-foreground">
                    <div className="flex flex-col items-center">
                      <span className="text-foreground font-bold">{creator.followers.toLocaleString()}</span>
                      <span className="text-xs">Learners</span>
                    </div>
                    <div className="h-8 w-px bg-border/60"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-foreground font-bold">{creator.videoCount}</span>
                      <span className="text-xs">Lessons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Become a Creator CTA */}
      <div className="mt-16 bg-gradient-to-r from-secondary/90 to-primary/90 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Have knowledge to share?</h2>
            <p className="text-lg text-white/90 mb-0">
              Join thousands of creators educating the next generation of India. Earn money, build your audience, and make an impact.
            </p>
          </div>
          <Link href="/studio">
            <Button size="lg" className="rounded-full bg-white text-secondary hover:bg-white/90 font-bold px-8 py-6 text-lg shadow-lg hover:scale-105 transition-transform">
              Become a Creator <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}