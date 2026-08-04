import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "@/lib/api";
import { LocationResult } from "@/components/location/types";

/* ================= TYPES ================= */

export interface Booking {
  _id: string;
  pickupLocation: LocationResult;
  dropLocation: LocationResult;
  status: "pending" | "accepted" | "ongoing" | "completed";
  fare?: number;
  routeDistance?: number;
  routeDuration?: number;
  createdAt?: string;
}

interface BookingContextType {
  currentBooking: Booking | null;
  isLoading: boolean;

  createBooking: (
    pickup: string,
    drop: string,
    pickupLocation?: LocationResult,
    dropLocation?: LocationResult,
    routeDistance?: number,
    routeDuration?: number,
    fare?: number
  ) => Promise<Booking>;

  clearCurrentBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error(
      "useBooking must be used within a BookingProvider"
    );
  }

  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

/* ================= PROVIDER ================= */

export const BookingProvider: React.FC<BookingProviderProps> = ({
  children,
}) => {
  const [currentBooking, setCurrentBooking] =
    useState<Booking | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  /* ================= CREATE BOOKING ================= */

  const createBooking = async (
    pickup: string,
    drop: string,
    pickupLocation?: LocationResult,
    dropLocation?: LocationResult,
    routeDistance?: number,
    routeDuration?: number,
    fare?: number
  ): Promise<Booking> => {

    setIsLoading(true);

    try {

      const res = await api.post(
        "/bookings/create",
        {
          pickup,
          drop,
          pickupLocation,
          dropLocation,
          routeDistance,
          routeDuration,
          fare,
        }
      );

      const booking = res.data.data;

      setCurrentBooking(booking);

      return booking;

    } catch (err) {

      console.error(err);

      throw err;

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