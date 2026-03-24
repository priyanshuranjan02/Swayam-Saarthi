import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import RegisterDriver from "./pages/RegisterDriver";
import UserDashboard from "./pages/UserDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateBooking from "./pages/CreateBooking";
import SelectDriver from "./pages/SelectDriver";
import BookingConfirmation from "./pages/BookingConfirmation";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/contexts/ThemeContext";
import DriverEarnings from "./pages/DriverEarnings";

// ✅ User History
import UserBookingHistory from "./pages/UserBookingHistory";

// ✅ Driver History (NEW)
import DriverBookingHistory from "./pages/DriverBookingHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <BookingProvider>
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register/user" element={<RegisterUser />} />
                  <Route path="/register/driver" element={<RegisterDriver />} />

                  {/* User Protected Routes */}
                  <Route
                    path="/user"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/my-trips"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <UserBookingHistory />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/create-booking"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <CreateBooking />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/select-driver/:bookingId"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <SelectDriver />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/booking-confirmation/:bookingId"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <BookingConfirmation />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/payment/:bookingId"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <Payment />
                      </ProtectedRoute>
                    }
                  />

                  {/* Driver Protected Routes */}
                  <Route
                    path="/driver"
                    element={
                      <ProtectedRoute allowedRoles={["driver"]}>
                        <DriverDashboard />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/driver/earnings"
                    element={
                      <ProtectedRoute allowedRoles={["driver"]}>
                        <DriverEarnings />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ DRIVER BOOKING HISTORY */}
                  <Route
                    path="/driver/trips"
                    element={
                      <ProtectedRoute allowedRoles={["driver"]}>
                        <DriverBookingHistory />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BookingProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
