import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import socket from "@/lib/socket";
import { toast } from "sonner";
import api from "@/lib/api";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;

  markAsRead: (
    id: string
  ) => Promise<void>;

  markAllAsRead: () => Promise<void>;
}

const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx)
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );

  return ctx;
};

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    // Don't fetch if user is not logged in
    if (!token) return;

    try {
      setLoading(true);

      const [notificationsRes, unreadRes] =
        await Promise.all([
          api.get("/notifications"),
          api.get("/notifications/unread-count"),
        ]);

      setNotifications(
        notificationsRes.data.data
      );

      setUnreadCount(
        unreadRes.data.data.count
      );

    } catch (error) {
      console.error(
        "FETCH NOTIFICATIONS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (
    id: string
  ) => {

    try {
      await api.patch(
        `/notifications/${id}/read`
      );

      await fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      await fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Don't initialize notifications until user logs in
    if (!token) return;
    
    fetchNotifications();
    
    const refreshNotifications = () => {
      fetchNotifications();
    };
  
    socket.on(
      "notification:new",
      refreshNotifications
    );
  
    return () => {
      socket.off(
        "notification:new",
        refreshNotifications
      );
    };
  }, []);

  return (

    <NotificationContext.Provider
      value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
    }}
    >
      {children}
    </NotificationContext.Provider>

  );
};