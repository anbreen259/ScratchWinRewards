import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const LayoutTab = ({ settings }: { settings: any }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: settings?.title || "Scratch & Win",
    instructionText: settings?.instructionText || "Scratch the card below to reveal your prize",
    primaryColor: settings?.primaryColor || "#1a365d",
    secondaryColor: settings?.secondaryColor || "#ffc107",
    cardBackground: settings?.cardBackground || "default.png",
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
        description: "Layout settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update layout settings.",
        variant: "destructive",
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveChanges = () => {
    updateSettingsMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-xl font-montserrat font-bold text-gray-800 mb-4">Game Appearance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Theme Colors</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Primary Color</label>
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded mr-2" 
                  style={{ backgroundColor: formData.primaryColor }}
                ></div>
                <Input 
                  type="text" 
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleInputChange}
                  className="border rounded py-2 px-3 text-sm w-24" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Secondary Color</label>
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded mr-2" 
                  style={{ backgroundColor: formData.secondaryColor }}
                ></div>
                <Input 
                  type="text" 
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleInputChange}
                  className="border rounded py-2 px-3 text-sm w-24" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Card Background</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="border-2 border-royal-blue-500 p-1 rounded">
              <img 
                src="https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60" 
                alt="Gold pattern background" 
                className="w-full h-auto rounded" 
              />
            </div>
            <div className="border p-1 rounded">
              <img 
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60" 
                alt="Gradient background" 
                className="w-full h-auto rounded" 
              />
            </div>
            <div className="border p-1 rounded">
              <img 
                src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60" 
                alt="Abstract pattern background" 
                className="w-full h-auto rounded" 
              />
            </div>
          </div>
          <Button 
            variant="outline"
            className="mt-3 text-sm bg-gray-200 hover:bg-gray-300 py-1 px-4 rounded"
          >
            Upload New
          </Button>
        </div>
      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Game Title</h4>
          <Input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border rounded py-2 px-3 w-full" 
          />
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Instruction Text</h4>
          <Textarea 
            name="instructionText"
            value={formData.instructionText}
            onChange={handleInputChange}
            className="border rounded py-2 px-3 w-full" 
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white py-2 px-6 rounded"
          onClick={handleSaveChanges}
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default LayoutTab;
