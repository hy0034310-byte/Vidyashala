import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListSectors } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Register() {
  const [, setLocation] = useLocation();
  const { data: sectors } = useListSectors();
  
  const [step, setStep] = useState(1);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  const toggleSector = (slug: string) => {
    if (selectedSectors.includes(slug)) {
      setSelectedSectors(selectedSectors.filter(s => s !== slug));
    } else {
      if (selectedSectors.length < 3) {
        setSelectedSectors([...selectedSectors, slug]);
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Simulate registration
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Card className="w-full max-w-lg border-border/40 shadow-2xl rounded-3xl bg-card/80 backdrop-blur-xl z-10">
        <CardHeader className="space-y-2 pb-6 text-center pt-8">
          <Link href="/">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 cursor-pointer shadow-md">
              <span className="text-primary-foreground font-serif font-bold text-2xl">V</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold font-serif text-foreground">
            {step === 1 ? "Create Account" : "Personalize Journey"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {step === 1 ? "Start your learning journey across India." : "What do you want to learn? (Select up to 3)"}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-8">
          <form onSubmit={handleRegister} className="space-y-5">
            
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Full Name</Label>
                  <Input id="name" placeholder="Rahul Sharma" className="h-12 bg-background" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="h-12 px-3 flex items-center justify-center bg-muted border border-input rounded-md text-sm font-medium">
                      +91
                    </div>
                    <Input id="mobile" placeholder="9876543210" className="h-12 bg-background flex-1" required pattern="[0-9]{10}" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold">Password</Label>
                  <Input id="password" type="password" placeholder="Create a strong password" className="h-12 bg-background" required minLength={8} />
                </div>

                <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl mt-4 shadow-md">
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                <div className="space-y-3">
                  <Label className="font-bold">Preferred Learning Language</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['English', 'Hindi', 'Tamil', 'Telugu'].map(lang => (
                      <div 
                        key={lang} 
                        className={`border rounded-xl p-3 text-center cursor-pointer font-medium transition-all ${lang === 'English' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border bg-background hover:border-primary/30'}`}
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-bold">Sectors of Interest</Label>
                  <div className="flex flex-wrap gap-2">
                    {sectors?.map(sector => {
                      const isSelected = selectedSectors.includes(sector.slug);
                      return (
                        <div 
                          key={sector.id}
                          onClick={() => toggleSector(sector.slug)}
                          className={`
                            border rounded-full px-4 py-2 text-sm cursor-pointer font-medium transition-all
                            ${isSelected 
                              ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                              : 'border-border bg-background hover:border-primary/40'
                            }
                          `}
                        >
                          {sector.name}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-12 w-1/3 rounded-xl font-bold">
                    Back
                  </Button>
                  <Button type="submit" className="h-12 flex-1 text-base font-bold rounded-xl shadow-md">
                    Complete Registration
                  </Button>
                </div>
              </div>
            )}
            
          </form>

          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground font-medium pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}