import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import AppLayout from "@/components/layout/AppLayout";

import Home from "@/pages/home";
import Watch from "@/pages/watch";
import Shorts from "@/pages/shorts";
import Explore from "@/pages/explore";
import Sector from "@/pages/sector";
import Quiz from "@/pages/quiz";
import Leaderboard from "@/pages/leaderboard";
import Community from "@/pages/community";
import AiChat from "@/pages/ai-chat";
import Creators from "@/pages/creators";
import Channel from "@/pages/channel";
import Studio from "@/pages/studio";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Register from "@/pages/register";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/watch/:id" component={Watch} />
        <Route path="/shorts" component={Shorts} />
        <Route path="/explore" component={Explore} />
        <Route path="/sector/:slug" component={Sector} />
        <Route path="/quiz/leaderboard" component={Leaderboard} />
        <Route path="/quiz/:id" component={Quiz} />
        <Route path="/community" component={Community} />
        <Route path="/ai-chat" component={AiChat} />
        <Route path="/creators" component={Creators} />
        <Route path="/channel/:id" component={Channel} />
        <Route path="/studio" component={Studio} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
