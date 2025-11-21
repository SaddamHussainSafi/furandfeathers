// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { fetchCurrentUser } from "../utils/fetchUser";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = (data) => {
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const normalizeUser = (data) => {
    if (!data) return null;
    return { ...data, role: (data.role || '').toString().toLowerCase() };
  };

  const refreshUser = useCallback(async () => {
    const data = await fetchCurrentUser();
    if (data) {
      const normalized = normalizeUser(data);
      persistUser(normalized);
      setUser(normalized);
      return normalized;
    }
    persistUser(null);
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    // On mount, try to revalidate token and refresh user data from backend
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = (userData, token) => {
    const normalizedUser = normalizeUser(userData);
    if (token) {
      localStorage.setItem("token", token);
    }
    persistUser(normalizedUser);
    setUser(normalizedUser);
  };

  const logout = () => {
    persistUser(null);
    setUser(null);
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

