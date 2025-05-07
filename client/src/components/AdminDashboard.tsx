import { useState } from "react";
import { Palette, Gift, Percent, Users, Settings } from "lucide-react";
import LayoutTab from "./AdminTabs/LayoutTab";
import PrizesTab from "./AdminTabs/PrizesTab";
import ProbabilityTab from "./AdminTabs/ProbabilityTab";
import UsersTab from "./AdminTabs/UsersTab";
import SettingsTab from "./AdminTabs/SettingsTab";

interface AdminDashboardProps {
  settings: any;
  stats: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminDashboard = ({ settings, stats, activeTab, setActiveTab }: AdminDashboardProps) => {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-montserrat font-bold text-gray-800 mb-4">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="text-blue-500 h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Players</div>
                <div className="text-2xl font-bold">{stats?.totalPlayers?.toLocaleString() || 0}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span className="mr-1">↑</span> {stats?.weeklyGrowth || 0}% from last week
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Gift className="text-green-500 h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Prizes Won</div>
                <div className="text-2xl font-bold">{stats?.prizesWon?.toLocaleString() || 0}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span className="mr-1">↑</span> 8% from last week
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <span role="img" aria-label="Gamepad" className="text-purple-500">🎮</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Games Played</div>
                <div className="text-2xl font-bold">{stats?.gamesPlayed?.toLocaleString() || 0}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span className="mr-1">↑</span> 15% from last week
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button 
              className={`py-4 px-6 font-medium ${
                activeTab === "layout" 
                  ? "text-royal-blue-600 border-b-2 border-royal-blue-500" 
                  : "text-gray-500 hover:text-royal-blue-600"
              }`}
              onClick={() => handleTabChange("layout")}
            >
              <Palette className="h-4 w-4 inline mr-2" />
              Layout
            </button>
            <button 
              className={`py-4 px-6 font-medium ${
                activeTab === "prizes" 
                  ? "text-royal-blue-600 border-b-2 border-royal-blue-500" 
                  : "text-gray-500 hover:text-royal-blue-600"
              }`}
              onClick={() => handleTabChange("prizes")}
            >
              <Gift className="h-4 w-4 inline mr-2" />
              Prizes
            </button>
            <button 
              className={`py-4 px-6 font-medium ${
                activeTab === "probability" 
                  ? "text-royal-blue-600 border-b-2 border-royal-blue-500" 
                  : "text-gray-500 hover:text-royal-blue-600"
              }`}
              onClick={() => handleTabChange("probability")}
            >
              <Percent className="h-4 w-4 inline mr-2" />
              Probability
            </button>
            <button 
              className={`py-4 px-6 font-medium ${
                activeTab === "users" 
                  ? "text-royal-blue-600 border-b-2 border-royal-blue-500" 
                  : "text-gray-500 hover:text-royal-blue-600"
              }`}
              onClick={() => handleTabChange("users")}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Users
            </button>
            <button 
              className={`py-4 px-6 font-medium ${
                activeTab === "settings" 
                  ? "text-royal-blue-600 border-b-2 border-royal-blue-500" 
                  : "text-gray-500 hover:text-royal-blue-600"
              }`}
              onClick={() => handleTabChange("settings")}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className={activeTab === "layout" ? "block" : "hidden"}>
        <LayoutTab settings={settings} />
      </div>
      
      <div className={activeTab === "prizes" ? "block" : "hidden"}>
        <PrizesTab />
      </div>
      
      <div className={activeTab === "probability" ? "block" : "hidden"}>
        <ProbabilityTab settings={settings} />
      </div>
      
      <div className={activeTab === "users" ? "block" : "hidden"}>
        <UsersTab />
      </div>
      
      <div className={activeTab === "settings" ? "block" : "hidden"}>
        <SettingsTab settings={settings} />
      </div>
    </div>
  );
};

export default AdminDashboard;
