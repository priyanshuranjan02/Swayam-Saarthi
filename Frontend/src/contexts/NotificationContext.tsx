import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import socket from "@/lib/socket";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
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

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const addNotification = (
    title: string,
    message: string
  ) => {

    setNotifications((prev) => [

      {
        id: crypto.randomUUID(),
        title,
        message,
        time: new Date().toLocaleTimeString(),
        read: false,
      },

      ...prev,

    ]);

  };

  useEffect(() => {
    socket.off("booking:new");
    socket.off("booking:accepted");
    socket.off("booking:rejected");
    socket.off("payment:confirmed");
    socket.off("ride:started");
    socket.off("ride:completed");

    socket.on("booking:new", (data) => {   
        toast.success(data.message);

      addNotification(
        "New Booking",
        `${data.pickup} → ${data.drop}`
      );
    });

    socket.on("booking:accepted", (data) => {
        toast.success(data.message);
        
      addNotification(
        "Booking Accepted",
        data.message
      );
    });

    socket.on("payment:confirmed", (data) => {
      toast.success(data.message);

      addNotification(
        "Payment Confirmed",
        data.message
      );
    
    });

    socket.on("booking:rejected", (data) => {
        toast.error(data.message);

      addNotification(
        "Booking Rejected",
        data.message
      );
    });

    socket.on("ride:started", (data) => {
      toast.success(data.message);

      addNotification(
        "Ride Started",
        data.message
      );

    });

    socket.on("ride:completed", (data) => {
      toast.success(data.message);

      addNotification(
        "Ride Completed",
        data.message
      );
    
    });

    return () => {
      socket.off("booking:new");
      socket.off("booking:accepted");
      socket.off("booking:rejected");
      socket.off("payment:confirmed");
      socket.off("ride:started");
      socket.off("ride:completed");
    };

  }, []);

  return (

    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount:
          notifications.filter((n) => !n.read).length,
        markAllAsRead: () =>
          setNotifications((prev) =>
            prev.map((n) => ({
              ...n,
              read: true,
            }))
          ),
      }}
    >
      {children}
    </NotificationContext.Provider>

  );
};