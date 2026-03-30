import React, { useState, useRef, useEffect } from "react";
import { useAskAI } from "@workspace/api-client-react";
import { Send, Bot, User, Sparkles, Mic, Lightbulb, BookOpen, BrainCircuit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  isStreaming?: boolean;
};

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Namaste! I am your VidyaShala AI Tutor. I can explain complex concepts, generate quizzes, create study plans, or translate learning materials. What would you like to learn today?"
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const askAiMutation = useAskAI();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (presetQuery?: string) => {
    const query = presetQuery || input;
    if (!query.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Add temporary AI loading message
    const aiId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiId, role: "ai", content: "", isStreaming: true }]);

    askAiMutation.mutate({
      data: {
        question: query,
        language: "en"
      }
    }, {
      onSuccess: (data) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiId ? { ...msg, content: data.answer, isStreaming: false } : msg
        ));
      },
      onError: () => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiId ? { ...msg, content: "Sorry, I encountered an error. Please try again.", isStreaming: false } : msg
        ));
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      
      {/* Top Banner */}
      <div className="border-b border-border/50 bg-card px-4 py-3 flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-md shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold font-serif text-lg leading-tight">Vidya AI Tutor</h1>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Online & Ready
            </p>
          </div>
        </div>
        <select className="bg-muted border border-border text-sm rounded-lg px-3 py-1.5 outline-none font-medium">
          <option>English</option>
          <option>हिंदी (Hindi)</option>
          <option>தமிழ் (Tamil)</option>
        </select>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar - Desktop Only */}
        <div className="hidden md:flex w-64 flex-col border-r border-border/50 bg-muted/20 p-4">
          <h3 className="font-bold font-serif mb-4 text-sm text-muted-foreground uppercase tracking-wider">Tutor Modes</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start font-medium bg-card border border-border/50 hover:border-primary/50 shadow-sm" onClick={() => handleSend("Explain quantum computing in simple terms for a beginner.")}>
              <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" /> Explain Simply
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium bg-card border border-border/50 hover:border-primary/50 shadow-sm" onClick={() => handleSend("Create a short 5-question quiz about React hooks.")}>
              <BrainCircuit className="mr-2 h-4 w-4 text-purple-500" /> Generate Quiz
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium bg-card border border-border/50 hover:border-primary/50 shadow-sm" onClick={() => handleSend("Make a 2-week study plan for learning Python.")}>
              <BookOpen className="mr-2 h-4 w-4 text-blue-500" /> Study Plan
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="font-bold font-serif mb-4 text-sm text-muted-foreground uppercase tracking-wider">Recent Topics</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Machine Learning</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Agriculture Tech</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">History of India</Badge>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none mix-blend-multiply"></div>
          
          <ScrollArea className="flex-1 p-4 md:p-6 relative z-10" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className={`h-8 w-8 mt-1 border ${msg.role === 'ai' ? 'border-primary/20 bg-primary/10' : 'border-border'}`}>
                      {msg.role === 'ai' ? (
                        <div className="w-full h-full flex items-center justify-center text-primary"><Bot size={18} /></div>
                      ) : (
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                      )}
                    </Avatar>
                    <div 
                      className={`max-w-[85%] rounded-2xl p-4 text-sm md:text-base leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-md' 
                          : 'bg-card border border-border/60 text-foreground rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.isStreaming ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span>Thinking...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 bg-background border-t border-border/50 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end gap-2 bg-card border border-border/60 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
                <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground shrink-0 mb-1">
                  <Mic className="h-5 w-5" />
                </Button>
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question, request a summary, or get a quiz..."
                  className="min-h-[50px] max-h-[150px] border-none focus-visible:ring-0 resize-none shadow-none bg-transparent py-3"
                  rows={1}
                />
                <Button 
                  size="icon" 
                  className="rounded-full bg-primary hover:bg-primary/90 text-white shrink-0 mb-1"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || askAiMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Prompts - Mobile only */}
              <div className="md:hidden flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-hide">
                <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-muted" onClick={() => handleSend("Explain quantum computing")}>Explain simply</Badge>
                <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-muted" onClick={() => handleSend("Generate a quiz on React")}>Quiz me</Badge>
                <Badge variant="outline" className="whitespace-nowrap cursor-pointer hover:bg-muted" onClick={() => handleSend("Create a study plan for English")}>Study plan</Badge>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}