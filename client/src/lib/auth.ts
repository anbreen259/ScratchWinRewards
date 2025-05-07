import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the type for the auth context
interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Storage keys
const TOKEN_KEY = "scratch_win_token";
const USER_KEY = "scratch_win_user";

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        // Clear invalid user data
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  // Check token validity
  useEffect(() => {
    if (token) {
      const checkToken = async () => {
        try {
          const response = await fetch("/api/auth/status", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // Token is invalid, log out
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to validate token:", error);
        }
      };

      checkToken();
    }
  }, [token]);

  const handleLogin = (newToken: string, newUser: any) => {
    // Store in state
    setToken(newToken);
    setUser(newUser);

    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const handleLogout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = {
    token,
    user,
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!token && !!user,
  };

  /* Using createElement instead of JSX for TypeScript compatibility */
  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};