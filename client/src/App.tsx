import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import Game from "./pages/Game";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Game} />
            <Route path="/login" component={Login} />
            <Route path="/admin" component={Admin} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
