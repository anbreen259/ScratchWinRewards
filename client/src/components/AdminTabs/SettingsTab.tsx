import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SettingsTabProps {
  settings: any;
}

const SettingsTab = ({ settings }: SettingsTabProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    enableGame: settings?.enableGame ?? true,
    showPrizeGallery: settings?.showPrizeGallery ?? true,
    enableWinAnimations: settings?.enableWinAnimations ?? true,
    requireUserRegistration: settings?.requireUserRegistration ?? false,
    enableSocialSharing: settings?.enableSocialSharing ?? false,
    playsPerUser: settings?.playsPerUser ?? "3 per day",
    countdownTimer: settings?.countdownTimer ?? 24,
    timerType: settings?.timerType ?? "Until next play",
    gameDuration: settings?.gameDuration ?? "1 month",
    adminNotifications: {
      emailOnHighValuePrize: settings?.adminNotifications?.emailOnHighValuePrize ?? true,
      dailySummaryReport: settings?.adminNotifications?.dailySummaryReport ?? true,
      lowStockAlerts: settings?.adminNotifications?.lowStockAlerts ?? false,
    },
    userNotifications: {
      prizeWinConfirmation: settings?.userNotifications?.prizeWinConfirmation ?? true,
      reminderToPlay: settings?.userNotifications?.reminderToPlay ?? true,
      marketingCommunications: settings?.userNotifications?.marketingCommunications ?? false,
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', '/api/settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Success",
        description: "Game settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update game settings.",
        variant: "destructive",
      });
    },
  });

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleNestedCheckboxChange = (parentField: string, field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof typeof prev],
        [field]: checked
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-xl font-montserrat font-bold text-gray-800 mb-4">Game Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">General Settings</h4>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <Checkbox 
                  checked={formData.enableGame} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("enableGame", checked as boolean)
                  }
                  className="h-5 w-5 text-royal-blue-600" 
                />
                <span className="ml-2 text-gray-700">Enable game</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <Checkbox 
                  checked={formData.showPrizeGallery} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("showPrizeGallery", checked as boolean)
                  }
                  className="h-5 w-5 text-royal-blue-600" 
                />
                <span className="ml-2 text-gray-700">Show prize gallery</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <Checkbox 
                  checked={formData.enableWinAnimations} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("enableWinAnimations", checked as boolean)
                  }
                  className="h-5 w-5 text-royal-blue-600" 
                />
                <span className="ml-2 text-gray-700">Enable win animations</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <Checkbox 
                  checked={formData.requireUserRegistration} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("requireUserRegistration", checked as boolean)
                  }
                  className="h-5 w-5 text-royal-blue-600" 
                />
                <span className="ml-2 text-gray-700">Require user registration</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <Checkbox 
                  checked={formData.enableSocialSharing} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("enableSocialSharing", checked as boolean)
                  }
                  className="h-5 w-5 text-royal-blue-600" 
                />
                <span className="ml-2 text-gray-700">Enable social sharing</span>
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Game Limits</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plays per user
              </label>
              <Select
                value={formData.playsPerUser}
                onValueChange={(value) => handleSelectChange("playsPerUser", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select plays per user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 per day">1 per day</SelectItem>
                  <SelectItem value="3 per day">3 per day</SelectItem>
                  <SelectItem value="5 per day">5 per day</SelectItem>
                  <SelectItem value="Unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Countdown timer
              </label>
              <div className="flex items-center">
                <Input
                  type="number"
                  name="countdownTimer"
                  value={formData.countdownTimer}
                  onChange={handleInputChange}
                  className="border rounded py-2 px-3 w-20"
                  min={0}
                />
                <span className="mx-2">hours</span>
                <Select
                  value={formData.timerType}
                  onValueChange={(value) => handleSelectChange("timerType", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Until next play">Until next play</SelectItem>
                    <SelectItem value="Until game ends">Until game ends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game duration
              </label>
              <div className="flex items-center">
                <Select
                  value={formData.gameDuration}
                  onValueChange={(value) => handleSelectChange("gameDuration", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select game duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No end date">No end date</SelectItem>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="1 month">1 month</SelectItem>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <hr className="my-6" />
      
      <h4 className="font-semibold mb-3">Notification Settings</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Notifications
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <Checkbox 
                checked={formData.adminNotifications.emailOnHighValuePrize} 
                onCheckedChange={(checked) => 
                  handleNestedCheckboxChange("adminNotifications", "emailOnHighValuePrize", checked as boolean)
                }
                className="h-5 w-5 text-royal-blue-600" 
              />
              <span className="ml-2 text-gray-700">Email on high-value prize win</span>
            </label>
            <label className="flex items-center">
              <Checkbox 
                checked={formData.adminNotifications.dailySummaryReport} 
                onCheckedChange={(checked) => 
                  handleNestedCheckboxChange("adminNotifications", "dailySummaryReport", checked as boolean)
                }
                className="h-5 w-5 text-royal-blue-600" 
              />
              <span className="ml-2 text-gray-700">Daily summary report</span>
            </label>
            <label className="flex items-center">
              <Checkbox 
                checked={formData.adminNotifications.lowStockAlerts} 
                onCheckedChange={(checked) => 
                  handleNestedCheckboxChange("adminNotifications", "lowStockAlerts", checked as boolean)
                }
                className="h-5 w-5 text-royal-blue-600" 
              />
              <span className="ml-2 text-gray-700">Low stock alerts</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Notifications
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <Checkbox 
                checked={formData.userNotifications.prizeWinConfirmation} 
                onCheckedChange={(checked) => 
                  handleNestedCheckboxChange("userNotifications", "prizeWinConfirmation", checked as boolean)
                }
                className="h-5 w-5 text-royal-blue-600" 
              />
              <span className="ml-2 text-gray-700">Prize win confirmation</span>
            </label>
            <label className="flex items-center">
              <Checkbox 
                checked={formData.userNotifications.reminderToPlay} 
                onCheckedChange={(checked) => 
                  handleNestedCheckboxChange("userNotifications", "reminderToPlay", checked as boolean)
                }
                className="h-5 w-5 text-royal-blue-600" 
              />
              <span className="ml-2 text-gray-700">Reminder to play</span>
            </label>
            <label className="flex items-center">
              <Checkbox 
                checked={formData.userNotifications.marketingCommunications} 
                onCheckedChange={(checked) => 
                  handleNestedCheckboxChange("userNotifications", "marketingCommunications", checked as boolean)
                }
                className="h-5 w-5 text-royal-blue-600" 
              />
              <span className="ml-2 text-gray-700">Marketing communications</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white py-2 px-6 rounded"
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
