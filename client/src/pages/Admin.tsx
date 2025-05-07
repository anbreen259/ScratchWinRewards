import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Cog, LogOut } from "lucide-react";
import AdminDashboard from "../components/AdminDashboard";
import { useAuth } from "../lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [, setLocation] = useLocation();
  const { user, logout, token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("layout");
  
  // Check authentication status
  useEffect(() => {
    if (!token) {
      setLocation("/login");
    }
  }, [token, setLocation]);
  
  // Fetch game settings
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    enabled: !!token,
  });
  
  // Fetch game stats
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!token,
  });
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/login");
  };
  
  const handleViewGame = () => {
    setLocation("/");
  };
  
  // If not authenticated, redirect to login
  if (!user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-royal-blue-700 text-white shadow-md">
        <div className="container mx-auto py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Cog className="text-premium-gold-500 h-6 w-6 mr-2" />
              <h1 className="text-xl font-montserrat font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <div className="mr-4 hidden md:block">
                <span className="text-sm">Welcome, {user.username}</span>
              </div>
              <Button 
                variant="outline" 
                className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white border-royal-blue-500 py-2 px-4 rounded text-sm mr-2"
                onClick={handleViewGame}
              >
                View Game
              </Button>
              <Button 
                variant="destructive"
                className="py-2 px-4 rounded text-sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Dashboard Component */}
      <AdminDashboard 
        settings={settings} 
        stats={stats}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Mobile Toggle */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button 
          className="bg-royal-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={handleViewGame}
        >
          <span role="img" aria-label="Game">🎮</span>
        </Button>
      </div>
    </div>
  );
};

export default Admin;
