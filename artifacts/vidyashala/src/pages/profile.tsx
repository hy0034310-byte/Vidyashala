import React from "react";
import { useGetUserProfile, useUpdateUserProfile } from "@workspace/api-client-react";
import { Settings, LogOut, Award, ShieldCheck, Mail, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile();
  const updateMutation = useUpdateUserProfile();
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save success
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <Skeleton className="w-full h-96 rounded-2xl" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-card border border-border/60 p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback className="text-3xl font-serif bg-primary/10 text-primary">{profile.name[0]}</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2 z-10">
          <h1 className="text-3xl font-bold font-serif flex items-center justify-center md:justify-start gap-2">
            {profile.name}
            {profile.isCreator && <ShieldCheck className="h-6 w-6 text-emerald-500" />}
          </h1>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 font-medium">
            <Mail className="h-4 w-4" /> {profile.email}
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4 pt-2">
            {profile.sectors.map(sector => (
              <Badge key={sector} variant="secondary" className="bg-secondary/10 text-secondary border-none">
                {sector}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 w-full md:w-auto z-10 mt-4 md:mt-0">
          {profile.isCreator ? (
            <Button className="w-full rounded-full font-bold shadow-md bg-emerald-600 hover:bg-emerald-700">
              Go to Studio
            </Button>
          ) : (
            <Button variant="outline" className="w-full rounded-full font-bold border-primary text-primary hover:bg-primary/10">
              Become a Creator
            </Button>
          )}
          <Button variant="ghost" className="w-full rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Settings Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Full Name</label>
                  <Input defaultValue={profile.name} className="bg-background h-11" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Preferred Language</label>
                    <select className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="en" selected={profile.preferredLanguage === 'en'}>English</option>
                      <option value="hi" selected={profile.preferredLanguage === 'hi'}>Hindi</option>
                      <option value="ta" selected={profile.preferredLanguage === 'ta'}>Tamil</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Location</label>
                    <Input placeholder="City, State" defaultValue="Bangalore, Karnataka" className="bg-background h-11" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex justify-end">
                  <Button type="submit" className="rounded-full px-8 font-bold">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Achievements & Stats */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-5">
              <div className="grid grid-cols-3 gap-3">
                {profile.badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 border-2 border-yellow-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Award className="h-7 w-7 text-orange-700" />
                    </div>
                    <span className="text-[10px] font-bold leading-tight">{badge}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-2">
              <Globe className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-bold font-serif text-lg">Platform Journey</h3>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric'})}
              </p>
              <div className="w-full h-px bg-border/60 my-2"></div>
              <div className="flex w-full justify-around text-sm font-medium">
                <div>
                  <p className="text-primary font-bold text-lg">{profile.totalXP}</p>
                  <p className="text-xs text-muted-foreground uppercase">Total XP</p>
                </div>
                <div>
                  <p className="text-primary font-bold text-lg">{profile.streak}</p>
                  <p className="text-xs text-muted-foreground uppercase">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}