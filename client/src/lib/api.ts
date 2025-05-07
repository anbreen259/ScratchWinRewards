import { apiRequest } from "./queryClient";

// Generic type for API response
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  statusCode: number;
}

// Type for login request
interface LoginRequest {
  username: string;
  password: string;
}

// Type for login response
interface LoginResponse {
  token: string;
  user: any;
}

// Login API function
export const login = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    
    if (!response.ok) {
      return {
        data: null,
        error: "Invalid credentials",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while logging in",
      statusCode: 500,
    };
  }
};

// Get all prizes
export const getPrizes = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await apiRequest("GET", "/api/prizes");
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to fetch prizes",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while fetching prizes",
      statusCode: 500,
    };
  }
};

// Create a new prize
export const createPrize = async (prize: any): Promise<ApiResponse<any>> => {
  try {
    const response = await apiRequest("POST", "/api/prizes", prize);
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to create prize",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while creating the prize",
      statusCode: 500,
    };
  }
};

// Update a prize
export const updatePrize = async (id: number, prize: any): Promise<ApiResponse<any>> => {
  try {
    const response = await apiRequest("PUT", `/api/prizes/${id}`, prize);
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to update prize",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while updating the prize",
      statusCode: 500,
    };
  }
};

// Delete a prize
export const deletePrize = async (id: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiRequest("DELETE", `/api/prizes/${id}`);
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to delete prize",
        statusCode: response.status,
      };
    }
    
    return {
      data: true,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while deleting the prize",
      statusCode: 500,
    };
  }
};

// Get game settings
export const getGameSettings = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiRequest("GET", "/api/settings");
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to fetch game settings",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while fetching game settings",
      statusCode: 500,
    };
  }
};

// Update game settings
export const updateGameSettings = async (settings: any): Promise<ApiResponse<any>> => {
  try {
    const response = await apiRequest("PUT", "/api/settings", settings);
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to update game settings",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while updating game settings",
      statusCode: 500,
    };
  }
};

// Play the game (scratch card)
export const playGame = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiRequest("POST", "/api/play");
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to play the game",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while playing the game",
      statusCode: 500,
    };
  }
};

// Get game stats
export const getGameStats = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiRequest("GET", "/api/stats");
    
    if (!response.ok) {
      return {
        data: null,
        error: "Failed to fetch game stats",
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: "An error occurred while fetching game stats",
      statusCode: 500,
    };
  }
};
