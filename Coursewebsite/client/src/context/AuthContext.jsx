import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error.response.data;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const response = await authService.login(userData);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error.response.data;
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context values
  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;