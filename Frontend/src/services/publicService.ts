import api from "@/lib/api";

export interface LandingStats {
  users: number;
  drivers: number;
  trips: number;
  rating: number;
}

export interface Testimonial {
  _id: string;
  rating: number;
  review: string;

  user?: {
    fullname: string;
  };

  driver?: {
    fullname: string;
  };

  createdAt: string;
}

export interface LandingData {
  stats: LandingStats;
  testimonials: Testimonial[];
}

export const getLandingData = async (): Promise<LandingData> => {
  const response = await api.get("/public/landing");

  return response.data;
};