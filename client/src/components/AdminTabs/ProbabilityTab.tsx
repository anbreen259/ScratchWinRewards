import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ProbabilityTab = ({ settings }: { settings: any }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [winRate, setWinRate] = useState(settings?.globalWinRate || 25);
  const [formData, setFormData] = useState({
    globalWinRate: settings?.globalWinRate || 25,
    timeBasedAdjustment: 'No adjustment',
    firstTimeBonus: true,
  });
  
  // Fetch prizes for distribution display
  const { data: prizes } = useQuery({
    queryKey: ["/api/prizes"],
  });
  
  useEffect(() => {
    if (settings) {
      setWinRate(settings.globalWinRate);
      setFormData({
        globalWinRate: settings.globalWinRate,
        timeBasedAdjustment: 'No adjustment',
        firstTimeBonus: true,
      });
    }
  }, [settings]);
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', '/api/settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Success",
        description: "Probability settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update probability settings.",
        variant: "destructive",
      });
    },
  });
  
  const handleWinRateChange = (value: number[]) => {
    setWinRate(value[0]);
    setFormData(prev => ({ ...prev, globalWinRate: value[0] }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: boolean) => {
    setFormData(prev => ({ ...prev, firstTimeBonus: value }));
  };
  
  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({ globalWinRate: formData.globalWinRate });
  };
  
  // Calculate total probability for active prizes
  const totalProbability = prizes
    ? prizes
        .filter((prize: any) => prize.isActive)
        .reduce((sum: number, prize: any) => sum + prize.probability, 0)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-xl font-montserrat font-bold text-gray-800 mb-4">Win Probability Settings</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Global Win Rate</h4>
          <div className="flex items-center space-x-4">
            <div className="w-full">
              <Slider 
                value={[winRate]} 
                max={100} 
                step={1} 
                onValueChange={handleWinRateChange}
              />
            </div>
            <span className="text-lg font-medium">{winRate}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Set the overall percentage of players who will win any prize</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Prize Distribution</h4>
          <div className="bg-gray-100 p-4 rounded">
            {prizes && prizes
              .filter((prize: any) => prize.isActive)
              .map((prize: any) => {
                const normalizedProbability = totalProbability > 0 
                  ? (prize.probability / totalProbability) * 100 
                  : 0;
                
                return (
                  <div className="relative pt-1 mb-4" key={prize.id}>
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-royal-blue-600">
                          {prize.name} {prize.description}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-royal-blue-600">
                          {normalizedProbability.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-royal-blue-200">
                      <div 
                        style={{ width: `${normalizedProbability}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-royal-blue-500"
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              {(!prizes || prizes.length === 0) && (
                <p className="text-sm text-gray-500">No active prizes found</p>
              )}
          </div>
        </div>
      </div>

      <hr className="my-6" />

      <h4 className="font-semibold mb-4">Advanced Settings</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time-based Win Rate Adjustment
          </label>
          <Select
            value={formData.timeBasedAdjustment}
            onValueChange={(value) => handleSelectChange("timeBasedAdjustment", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select adjustment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No adjustment">No adjustment</SelectItem>
              <SelectItem value="Increase on weekends">Increase on weekends</SelectItem>
              <SelectItem value="Decrease during peak hours">Decrease during peak hours</SelectItem>
              <SelectItem value="Custom schedule">Custom schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First-time Player Bonus
          </label>
          <div className="flex items-center">
            <label className="inline-flex items-center mr-6">
              <input 
                type="radio" 
                className="form-radio" 
                checked={formData.firstTimeBonus}
                onChange={() => handleRadioChange(true)}
              />
              <span className="ml-2">Enabled</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                className="form-radio" 
                checked={!formData.firstTimeBonus}
                onChange={() => handleRadioChange(false)}
              />
              <span className="ml-2">Disabled</span>
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

export default ProbabilityTab;
