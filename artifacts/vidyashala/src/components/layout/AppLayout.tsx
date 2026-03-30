import React from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, Home, PlaySquare, Compass, LayoutDashboard, Sparkles, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shorts", label: "Shorts", icon: PlaySquare },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/community", label: "Community", icon: MessageCircle },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  // Don't show regular layout on auth pages or full screen shorts
  const isAuthPage = location === "/login" || location === "/register";
  const isShortsPage = location === "/shorts";
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-xl">V</span>
              </div>
              <span className="font-serif font-bold text-xl hidden sm:inline-block tracking-tight text-foreground">
                VidyaShala
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl px-4 hidden md:flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons, creators, or topics..."
                className="w-full pl-10 bg-muted/50 border-transparent focus-visible:ring-primary/20 rounded-full h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center border rounded-full px-3 py-1 bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground mr-2">Language:</span>
              <select className="bg-transparent text-sm font-medium outline-none cursor-pointer focus:ring-0">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">தமிழ்</option>
              </select>
            </div>
            
            <Button variant="ghost" size="icon" className="relative rounded-full text-foreground/80 hover:text-foreground hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
            </Button>
            
            <Link href="/profile">
              <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">AK</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Floating AI Assistant Button */}
      <Link href="/ai-chat" className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
        <motion.div
          animate={{
            boxShadow: ["0px 0px 0px 0px rgba(255, 107, 53, 0)", "0px 0px 20px 5px rgba(255, 107, 53, 0.4)", "0px 0px 0px 0px rgba(255, 107, 53, 0)"],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full"
        >
          <Button size="icon" className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl">
            <Sparkles className="h-6 w-6" />
          </Button>
        </motion.div>
      </Link>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center justify-center w-16 h-full space-y-1">
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}