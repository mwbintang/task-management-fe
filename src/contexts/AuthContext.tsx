import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types/ticket";
import { mockUsers } from "@/lib/mockData";
import { loginService } from "@/services/user";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {

      // Mock authentication - in production, this would call an API
      const resLogin = await loginService(email, password)
      if (resLogin.success) {
        // Save the token in localStorage
        if (resLogin.data.token) {
          localStorage.setItem("token", resLogin.data.token);
        }

        // Save the user info in state
        setUser(resLogin.data.user);

        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
