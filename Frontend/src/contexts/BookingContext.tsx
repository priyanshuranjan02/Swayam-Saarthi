import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "@/lib/api";

/* ================= TYPES ================= */

export interface Booking {
  _id: string;
  pickupLocation: string;
  dropLocation: string;
  status: "pending" | "ongoing" | "completed";
  fare?: number;
  createdAt?: string;
}

interface BookingContextType {
  currentBooking: Booking | null;
  isLoading: boolean;
  createBooking: (pickup: string, drop: string) => Promise<Booking>;
  clearCurrentBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

/* ================= PROVIDER ================= */

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ================= CREATE BOOKING ================= */
  const createBooking = async (
    pickup: string,
    drop: string
  ): Promise<Booking> => {
    setIsLoading(true);
    try {
      const res = await api.post("/bookings/create", {
        pickup,
        drop,
      });

      const booking = res.data.data;
      setCurrentBooking(booking);

      return booking; // 🔥 RETURN REAL MONGODB BOOKING
    } finally {
      setIsLoading(false);
    }
  };

  const clearCurrentBooking = () => {
    setCurrentBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        currentBooking,
        isLoading,
        createBooking,
        clearCurrentBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};