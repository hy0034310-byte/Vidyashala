import React, { useState } from "react";
import { useCreateVideo, useListSectors } from "@workspace/api-client-react";
import { UploadCloud, FileVideo, Video, Image as ImageIcon, FileText, BrainCircuit, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Studio() {
  const { data: sectors } = useListSectors();
  const createVideoMutation = useCreateVideo();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sector: "",
    language: "",
    difficulty: "Beginner",
    type: "video" // video or short
  });

  const [aiFeatures, setAiFeatures] = useState({
    autoTranscript: true,
    generateNotes: false,
    generateFlashcards: false,
    generateQuiz: false,
    multilingualDub: false
  });

  const handlePublish = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      createVideoMutation.mutate({
        data: {
          ...formData,
          creatorId: 1, // Mock user ID
          thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
          duration: "10:00",
        }
      }, {
        onSuccess: () => {
          setIsUploading(false);
          setStep(3); // Success step
          toast({
            title: "Lesson Published Successfully! 🎉",
            description: "Your content is now live and available to learners.",
          });
        }
      });
    }, 2000);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Creator Studio</h1>
        <p className="text-muted-foreground text-lg">Upload and enhance your educational content.</p>
      </div>

      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-primary/30 rounded-3xl bg-primary/5 p-12 text-center hover:bg-primary/10 transition-colors cursor-pointer flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-background rounded-full shadow-sm flex items-center justify-center mb-6">
                <UploadCloud className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Drag & Drop Video</h3>
              <p className="text-muted-foreground mb-6">MP4, WebM up to 2GB</p>
              <Button size="lg" className="rounded-full px-8 font-semibold shadow-md">Select File</Button>
            </div>

            {/* Content Type Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`p-4 border-2 rounded-2xl cursor-pointer flex flex-col items-center gap-3 transition-all ${formData.type === 'video' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
                onClick={() => setFormData({...formData, type: 'video'})}
              >
                <Video className={`h-8 w-8 ${formData.type === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-center">
                  <p className="font-bold">Long-form Lesson</p>
                  <p className="text-xs text-muted-foreground">In-depth tutorial (5+ mins)</p>
                </div>
              </div>
              <div 
                className={`p-4 border-2 rounded-2xl cursor-pointer flex flex-col items-center gap-3 transition-all ${formData.type === 'short' ? 'border-accent bg-accent/5' : 'border-border bg-card hover:border-accent/50'}`}
                onClick={() => setFormData({...formData, type: 'short'})}
              >
                <FileVideo className={`h-8 w-8 ${formData.type === 'short' ? 'text-accent' : 'text-muted-foreground'}`} />
                <div className="text-center">
                  <p className="font-bold">Short Reel</p>
                  <p className="text-xs text-muted-foreground">Quick bite (&lt; 60 secs)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={() => setStep(2)} className="rounded-full font-bold px-8">
                Continue to Details
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/60 shadow-sm bg-card">
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Title</Label>
                    <Input 
                      placeholder="e.g., Introduction to React Hooks" 
                      className="h-12 bg-background"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base font-bold">Description</Label>
                    <Textarea 
                      placeholder="Explain what learners will achieve..." 
                      className="min-h-[120px] bg-background"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-base font-bold">Sector</Label>
                      <Select value={formData.sector} onValueChange={(v) => setFormData({...formData, sector: v})}>
                        <SelectTrigger className="h-12 bg-background">
                          <SelectValue placeholder="Choose sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors?.map(s => <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-base font-bold">Language</Label>
                      <Select value={formData.language} onValueChange={(v) => setFormData({...formData, language: v})}>
                        <SelectTrigger className="h-12 bg-background">
                          <SelectValue placeholder="Choose language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Enhancements Panel */}
              <Card className="border-primary/30 shadow-md bg-gradient-to-br from-card to-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Sparkles className="w-24 h-24" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold font-serif">Vidya AI Enhancements</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">Auto Transcript & Subtitles</span>
                        <span className="text-xs text-muted-foreground">Generate accurate captions automatically</span>
                      </div>
                      <Switch checked={aiFeatures.autoTranscript} onCheckedChange={(v) => setAiFeatures({...aiFeatures, autoTranscript: v})} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">Generate PDF Notes</span>
                          <span className="text-xs text-muted-foreground">Create study materials from video audio</span>
                        </div>
                      </div>
                      <Switch checked={aiFeatures.generateNotes} onCheckedChange={(v) => setAiFeatures({...aiFeatures, generateNotes: v})} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <BrainCircuit className="h-5 w-5 text-orange-500" />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">Generate Flashcards & Quiz</span>
                          <span className="text-xs text-muted-foreground">Extract key terms and assessment questions</span>
                        </div>
                      </div>
                      <Switch checked={aiFeatures.generateFlashcards} onCheckedChange={(v) => setAiFeatures({...aiFeatures, generateFlashcards: v})} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full">Back</Button>
                <Button 
                  size="lg" 
                  onClick={handlePublish} 
                  disabled={!formData.title || !formData.sector || !formData.language || isUploading}
                  className="rounded-full font-bold px-10 shadow-md"
                >
                  {isUploading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing...</>
                  ) : (
                    "Publish Lesson"
                  )}
                </Button>
              </div>
            </div>

            {/* Right Col: Thumbnail & Preview */}
            <div className="space-y-6">
              <Card className="border-border/60 bg-card">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-bold">Thumbnail</h3>
                  <div className="aspect-video bg-muted rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors relative overflow-hidden group">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Upload Image</span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">1280x720 (16:9) recommended</p>
                </CardContent>
              </Card>

              {/* Real-time Preview Card */}
              <div className="p-4 border border-border/50 rounded-2xl bg-card shadow-sm opacity-80 pointer-events-none">
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3 text-center">Card Preview</h4>
                <div className="aspect-video bg-muted rounded-xl mb-3"></div>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px]">{formData.sector || "Sector"}</Badge>
                </div>
                <h5 className="font-bold text-sm line-clamp-2">{formData.title || "Your video title will appear here"}</h5>
                <p className="text-xs text-muted-foreground mt-2">Your Channel Name</p>
              </div>
            </div>

          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6"
          >
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif">Published Successfully!</h2>
            <p className="text-lg text-muted-foreground max-w-md">
              Your lesson is now processing. Our AI is generating the transcript, notes, and quiz. This usually takes a few minutes.
            </p>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="rounded-full px-6" onClick={() => {
                setStep(1);
                setFormData({title: "", description: "", sector: "", language: "", difficulty: "Beginner", type: "video"});
              }}>Upload Another</Button>
              <Link href="/channel/1">
                <Button className="rounded-full px-6 shadow-md">Go to Channel</Button>
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}