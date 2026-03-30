import React, { useState, useRef, useEffect } from "react";
import { useListShorts, useLikeVideo } from "@workspace/api-client-react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  BrainCircuit,
  CheckCircle2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Shorts() {
  const { data: shorts, isLoading } = useListShorts();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle intersection observer to know which short is in view
  useEffect(() => {
    if (!containerRef.current || !shorts?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    const videoElements = containerRef.current.querySelectorAll('.short-container');
    videoElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [shorts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-black">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
      ref={containerRef}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex flex-col items-center py-4 md:py-8 gap-8 w-full max-w-lg mx-auto">
        {shorts?.map((short, index) => (
          <ShortVideo 
            key={short.id} 
            short={short} 
            isActive={activeIndex === index} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
}

function ShortVideo({ short, isActive, index }: { short: any, isActive: boolean, index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(short.likes);
  const [showQuickQuiz, setShowQuickQuiz] = useState(false);

  useEffect(() => {
    setIsPlaying(isActive);
  }, [isActive]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div 
      className="short-container w-full h-[calc(100vh-8rem)] md:h-[80vh] min-h-[500px] max-h-[850px] relative rounded-2xl overflow-hidden snap-center bg-zinc-900 shadow-2xl flex-shrink-0 border border-white/10 group"
      data-index={index}
      onClick={togglePlay}
    >
      {/* Video Background (Mock) */}
      <img 
        src={short.thumbnailUrl} 
        alt={short.title} 
        className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>

      {/* Play/Pause Indicator Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <Play className="h-10 w-10 text-white ml-2" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="flex gap-2">
          <Badge className="bg-black/50 hover:bg-black/70 text-white border-white/20 backdrop-blur-md">
            {short.sector}
          </Badge>
          <Badge className="bg-primary/80 hover:bg-primary text-white border-none backdrop-blur-md">
            {short.language.toUpperCase()}
          </Badge>
        </div>
        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full bg-black/20 backdrop-blur-md">
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Bottom Info Info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 z-10 flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border border-white/50">
            <AvatarImage src={short.creatorAvatar} />
            <AvatarFallback>{short.creatorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="font-bold text-white text-base drop-shadow-md">{short.creatorName}</span>
            {short.isVerified && <CheckCircle2 className="h-4 w-4 text-primary drop-shadow-md" />}
          </div>
          <Button size="sm" variant="outline" className="h-7 rounded-full bg-transparent text-white border-white/50 hover:bg-white/20 backdrop-blur-sm ml-2 text-xs">
            Subscribe
          </Button>
        </div>
        
        <p className="text-white font-medium text-sm md:text-base leading-snug drop-shadow-lg mb-2">
          {short.title}
        </p>

        {/* Quick Quiz Prompt if available */}
        {short.hasQuickQuiz && (
          <div 
            className="mt-2 bg-accent/90 hover:bg-accent backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 w-max cursor-pointer transition-colors shadow-lg border border-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickQuiz(true);
            }}
          >
            <BrainCircuit className="h-4 w-4" />
            <span className="font-semibold text-sm">Test Your Knowledge</span>
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="absolute bottom-4 right-2 flex flex-col items-center gap-5 z-20 w-14">
        <div className="flex flex-col items-center gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-transform active:scale-90"
            onClick={handleLike}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <span className="text-white text-xs font-semibold drop-shadow-md">
            {likes >= 1000 ? `${(likes/1000).toFixed(1)}k` : likes}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md">
            <MessageCircle className="h-6 w-6 fill-white/20" />
          </Button>
          <span className="text-white text-xs font-semibold drop-shadow-md">1.2k</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md">
            <Bookmark className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs font-semibold drop-shadow-md">Save</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md">
            <Share2 className="h-6 w-6" />
          </Button>
          <span className="text-white text-xs font-semibold drop-shadow-md">Share</span>
        </div>

        <Button size="icon" variant="ghost" className="h-10 w-10 mt-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-primary" 
          style={{ width: isPlaying ? '45%' : '0%', transition: isPlaying ? 'width 10s linear' : 'none' }}
        ></div>
      </div>
    </div>
  );
}