import {
  useState,
  useContext,
  useEffect,
  createContext,
  Children,
} from "react";

import api from "../api/axios";
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    fetchUser();
  }, []);
  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    const userData = res.data;

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
