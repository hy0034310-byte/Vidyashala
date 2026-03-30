import React, { useState } from "react";
import { useListCommunityPosts, useCreateCommunityPost, useListSectors } from "@workspace/api-client-react";
import { MessageSquare, ThumbsUp, Share2, Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Community() {
  const [activeSector, setActiveSector] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", sector: "" });
  
  const { data: sectors } = useListSectors();
  const { data: posts, isLoading } = useListCommunityPosts(
    activeSector !== "all" ? { sector: activeSector } : {}
  );
  
  const createMutation = useCreateCommunityPost();

  const handleSubmit = () => {
    if (!newPost.title || !newPost.content || !newPost.sector) return;
    
    createMutation.mutate({
      data: newPost
    }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setNewPost({ title: "", content: "", sector: "" });
      }
    });
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 space-y-6 flex-shrink-0">
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-serif mb-4">Sectors</h2>
          <Button 
            variant={activeSector === "all" ? "default" : "ghost"} 
            className={`w-full justify-start rounded-xl ${activeSector === "all" ? '' : 'font-normal'}`}
            onClick={() => setActiveSector("all")}
          >
            All Discussions
          </Button>
          {sectors?.map(sector => (
            <Button 
              key={sector.id}
              variant={activeSector === sector.slug ? "default" : "ghost"} 
              className={`w-full justify-start rounded-xl ${activeSector === sector.slug ? '' : 'font-normal'}`}
              onClick={() => setActiveSector(sector.slug)}
            >
              {sector.name}
            </Button>
          ))}
        </div>
        
        <div className="bg-primary/10 p-5 rounded-2xl border border-primary/20">
          <h3 className="font-bold text-primary mb-2">Community Guidelines</h3>
          <ul className="text-sm space-y-2 text-foreground/80">
            <li>• Be respectful and kind</li>
            <li>• Ask clear questions</li>
            <li>• Share knowledge openly</li>
            <li>• No spam or promotion</li>
          </ul>
        </div>
      </aside>

      {/* Main Feed */}
      <div className="flex-1 space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search discussions..." className="pl-9 rounded-full bg-card" />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto rounded-full font-semibold shadow-md">
                <Plus className="mr-2 h-5 w-5" /> New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">Start a Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    placeholder="What do you want to ask or share?" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sector</label>
                  <Select onValueChange={(val) => setNewPost({...newPost, sector: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a relevant sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors?.map(s => (
                        <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Details</label>
                  <Textarea 
                    placeholder="Provide more context, code snippets, or details..." 
                    rows={5}
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  />
                </div>
                <Button 
                  className="w-full rounded-full mt-2" 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || !newPost.title || !newPost.content || !newPost.sector}
                >
                  {createMutation.isPending ? "Posting..." : "Post Discussion"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile Filter */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <Button 
            size="sm"
            variant={activeSector === "all" ? "default" : "outline"} 
            className="rounded-full flex-shrink-0"
            onClick={() => setActiveSector("all")}
          >
            All
          </Button>
          {sectors?.map(sector => (
            <Button 
              key={sector.id}
              size="sm"
              variant={activeSector === sector.slug ? "default" : "outline"} 
              className="rounded-full flex-shrink-0"
              onClick={() => setActiveSector(sector.slug)}
            >
              {sector.name}
            </Button>
          ))}
        </div>

        {/* Feed list */}
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="p-4"><Skeleton className="h-24 w-full" /></Card>
            ))
          ) : posts?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No discussions yet</h3>
              <p className="text-muted-foreground">Be the first to start a conversation in this sector.</p>
            </div>
          ) : (
            posts?.map((post) => (
              <Card key={post.id} className="border-border/50 hover:border-primary/30 transition-colors shadow-sm bg-card overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-start gap-4">
                  <Avatar className="h-10 w-10 mt-1 border border-border">
                    <AvatarImage src={post.authorAvatar} />
                    <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground/80">{post.authorName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight font-serif hover:text-primary cursor-pointer transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="pb-3 text-foreground/90">
                  <p className="line-clamp-3 text-sm leading-relaxed">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">{post.sector}</Badge>
                    {post.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs text-muted-foreground border-border/50">#{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border/40 flex items-center gap-6">
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                    <ThumbsUp className="h-4 w-4" /> {post.likes} Likes
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                    <MessageSquare className="h-4 w-4" /> {post.commentCount} Replies
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium ml-auto">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}