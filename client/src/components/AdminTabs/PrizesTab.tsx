import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PrizesTab = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<any>(null);
  const [deletingPrizeId, setDeletingPrizeId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Physical",
    value: "",
    icon: "gift",
    stock: 10,
    isActive: true,
    probability: 10,
  });
  
  // Fetch prizes
  const { data: prizes, isLoading } = useQuery({
    queryKey: ["/api/prizes"],
  });
  
  const createPrizeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/prizes', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prizes'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Prize has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create prize.",
        variant: "destructive",
      });
    },
  });
  
  const updatePrizeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const response = await apiRequest('PUT', `/api/prizes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prizes'] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Prize has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update prize.",
        variant: "destructive",
      });
    },
  });
  
  const deletePrizeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/prizes/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prizes'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Prize has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete prize.",
        variant: "destructive",
      });
    },
  });
  
  const handleAddPrize = () => {
    setEditingPrize(null);
    setFormData({
      name: "",
      description: "",
      type: "Physical",
      value: "",
      icon: "gift",
      stock: 10,
      isActive: true,
      probability: 10,
    });
    setIsDialogOpen(true);
  };
  
  const handleEditPrize = (prize: any) => {
    setEditingPrize(prize);
    setFormData({
      name: prize.name,
      description: prize.description,
      type: prize.type,
      value: prize.value,
      icon: prize.icon,
      stock: prize.stock,
      isActive: prize.isActive,
      probability: prize.probability,
    });
    setIsDialogOpen(true);
  };
  
  const handleDeletePrize = (id: number) => {
    setDeletingPrizeId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    if (editingPrize) {
      updatePrizeMutation.mutate({ id: editingPrize.id, data: formData });
    } else {
      createPrizeMutation.mutate(formData);
    }
  };
  
  const handleConfirmDelete = () => {
    if (deletingPrizeId !== null) {
      deletePrizeMutation.mutate(deletingPrizeId);
    }
  };
  
  // Icon options for prizes
  const iconOptions = [
    { value: "gift", label: "Gift" },
    { value: "star", label: "Star" },
    { value: "percent", label: "Percent" },
    { value: "clock", label: "Clock" },
    { value: "box", label: "Box" },
    { value: "gamepad", label: "Gamepad" },
  ];
  
  if (isLoading) {
    return <div>Loading prizes...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-montserrat font-bold text-gray-800">Prizes Management</h3>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
            onClick={handleAddPrize}
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Prize
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prize
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prizes?.map((prize: any) => (
                <tr key={prize.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-premium-gold-100 rounded-full flex items-center justify-center text-premium-gold-600">
                        <span role="img" aria-label={prize.icon}>
                          {prize.icon === "gift" && "🎁"}
                          {prize.icon === "star" && "⭐"}
                          {prize.icon === "percent" && "%"}
                          {prize.icon === "clock" && "⏰"}
                          {prize.icon === "box" && "📦"}
                          {prize.icon === "gamepad" && "🎮"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{prize.name} {prize.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prize.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prize.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prize.stock === 0 ? "Unlimited" : prize.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prize.probability}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      prize.isActive 
                        ? prize.stock <= 5 && prize.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {prize.isActive 
                        ? prize.stock <= 5 && prize.stock > 0
                          ? "Low Stock"
                          : "Active"
                        : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost"
                      className="text-royal-blue-600 hover:text-royal-blue-900 mr-3"
                      onClick={() => handleEditPrize(prize)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeletePrize(prize.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Prize Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPrize ? "Edit Prize" : "Add New Prize"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. $100"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Gift Card"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Digital">Digital</SelectItem>
                    <SelectItem value="Discount">Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <Input 
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="e.g. $100.00 or Variable"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => handleSelectChange("icon", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock (0 for unlimited)
                </label>
                <Input 
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probability (%)
                </label>
                <Input 
                  type="number"
                  name="probability"
                  value={formData.probability}
                  onChange={handleInputChange}
                  min={0}
                  max={100}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) => handleSelectChange("isActive", value === "active" ? "true" : "false")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={createPrizeMutation.isPending || updatePrizeMutation.isPending}
            >
              {editingPrize ? "Update Prize" : "Create Prize"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Prize</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete this prize? This action cannot be undone.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deletePrizeMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrizesTab;
