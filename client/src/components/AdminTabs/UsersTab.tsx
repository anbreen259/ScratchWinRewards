import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Trash2, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UsersTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/users"],
  });
  
  const filteredUsers = users
    ? users.filter((user: any) => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];
    
  const totalPages = Math.ceil((filteredUsers?.length || 0) / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleAddUser = () => {
    // Implement user creation functionality
    console.log("Add user clicked");
  };
  
  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-montserrat font-bold text-gray-800">User Management</h3>
        <div className="flex">
          <div className="relative mr-4">
            <Input 
              type="text" 
              placeholder="Search users..." 
              className="border rounded-lg py-2 px-4 pr-10 w-64"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="text-gray-400 h-4 w-4" />
            </div>
          </div>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
            onClick={handleAddUser}
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Games Played
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prizes Won
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user: any) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-royal-blue-100 flex items-center justify-center">
                      <span className="font-medium text-royal-blue-800">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email || ""}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "admin" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleString() 
                    : "Never"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.gamesPlayed || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.prizesWon || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button 
                    variant="ghost"
                    className="text-royal-blue-600 hover:text-royal-blue-900 mr-3"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost"
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {paginatedUsers.length} of {filteredUsers.length} users
          </div>
          <div className="flex items-center">
            <Button 
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-700 py-1 px-3 rounded-l"
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button 
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className={`py-1 px-3 ${
                  page === currentPage 
                    ? "bg-royal-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-700 py-1 px-3 rounded-r"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
