import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import socket from "@/lib/socket";

/* ================= TYPES ================= */

export type UserRole = "user" | "driver" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<UserRole>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  registerDriver: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

/* ================= PROVIDER ================= */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  /* ---------- Load session ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedToken && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole as UserRole);
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }

    setIsLoading(false);
  }, []);

  /* ---------- LOGIN ---------- */
  const login = async (
    email: string,
    password: string
  ): Promise<UserRole> => {
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", res.data);

      const { token, account } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(account));
      localStorage.setItem("role", account.role);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setUser(account);
      setRole(account.role);

      return account.role;
    } catch (error: any) {
      // Better error surface for UI
      throw error.response?.data?.message || "Login failed";
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  if (!user?.id) return;

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("join", user.id);

  return () => {
    socket.off("booking:new");
    socket.off("booking:accepted");
    socket.off("booking:completed");
  };
}, [user?.id]);


  /* ---------- REGISTER USER ---------- */
  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register-user", {
        name,
        email,
        password
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- REGISTER DRIVER ---------- */
  const registerDriver = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register-driver", {
        name,
        email,
        password
      });

      toast.success("Driver account created");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    setRole(null);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerUser,
        registerDriver,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};