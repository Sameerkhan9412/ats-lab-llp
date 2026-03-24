// app/types/admin.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: "admin" | "user" | "lab_manager";
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface PTBooking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  programId: string;
  programName: string;
  programCode: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  bookedAt: string;
  startDate: string;
  endDate: string;
  paymentStatus: "paid" | "unpaid" | "partial";
  amount: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  pendingBookings: number;
  completedPrograms: number;
  revenue: number;
  newUsersThisMonth: number;
  bookingsThisMonth: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}