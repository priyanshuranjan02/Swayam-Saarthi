import axios from "axios";

/**
 * =========================
 * BASE AXIOS INSTANCE
 * =========================
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * =========================
 * REQUEST INTERCEPTOR
 * =========================
 * Attaches JWT token automatically
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 * Auto logout on 401
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * =========================
 * AUTH API
 * =========================
 */
export const authAPI = {
  login: (email: string, password: string, role: string) =>
    api.post("/auth/login", { email, password, role }),

  registerUser: (name: string, email: string, password: string) =>
    api.post("/auth/register-user", { name, email, password }),

  registerDriver: (name: string, email: string, password: string) =>
    api.post("/auth/register-driver", { name, email, password }),
};

/**
 * =========================
 * BOOKINGS API
 * =========================
 */
export const bookingsAPI = {
  // STEP 1: Create booking
  createBooking: (pickup: string, drop: string) =>
    api.post("/bookings/create", { pickup, drop }),

  // STEP 2: Get available drivers
  getAvailableDrivers: () => api.get("/bookings/drivers"),

  // STEP 2 → STEP 3: Assign driver
  assignDriver: (bookingId: string, driverId: string) =>
    api.put(`/bookings/assign/${bookingId}`, { driverId }),

  // STEP 3: Get booking details
  getBookingById: (bookingId: string) =>
    api.get(`/bookings/${bookingId}`),

  // STEP 3: Complete booking
  completeBooking: (bookingId: string) =>
    api.put(`/bookings/complete/${bookingId}`),
};

/**
 * =========================
 * DRIVER API
 * =========================
 */
export const driverAPI = {
  getProfile: () => api.get("/driver/me"),

  updateAvailability: (isAvailable: boolean) =>
    api.patch("/driver/availability", { isAvailable }),
};

/**
 * =========================
 * PAYMENT API (MOCK)
 * =========================
 */
export const paymentAPI = {
  processPayment: (bookingId: string, method: string) =>
    api.post(`/payment/pay`, { bookingId, method }),
};

export default api;