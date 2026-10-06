import { apiRequest } from "../../lib/api";

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface BookingHostel {
  id?: string;
  _id?: string;
  name: string;
  address?: string;
  type?: string;
  monthlyRent: number;
  images?: string[];
  city?: string;
  area?: string;
}

export interface BookingOwner {
  id?: string;
  _id?: string;
  name: string;
  email: string;
}

export interface Booking {
  id?: string;
  _id?: string;
  user: string;
  hostel: BookingHostel;
  owner: BookingOwner;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  status: BookingStatus;
  monthlyRent: number;
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyBookingsResponse {
  success: boolean;
  count: number;
  data: Booking[];
}

export interface BookingResponse {
  success: boolean;
  message?: string;
  data: Booking;
}

export const getMyBookings = (token: string): Promise<MyBookingsResponse> => {
  return apiRequest<MyBookingsResponse>("/bookings/my", {
    method: "GET",
    token,
  });
};

export const getMyBookingById = (
  token: string,
  bookingId: string,
): Promise<BookingResponse> => {
  return apiRequest<BookingResponse>("/bookings/my/" + bookingId, {
    method: "GET",
    token,
  });
};

export interface CreateBookingData {
  hostel: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}

export const createBooking = (
  token: string,
  data: CreateBookingData,
): Promise<BookingResponse> => {
  return apiRequest<BookingResponse>("/bookings", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
};

export const cancelMyBooking = (
  token: string,
  bookingId: string,
): Promise<BookingResponse> => {
  return apiRequest<BookingResponse>("/bookings/my/" + bookingId + "/cancel", {
    method: "PATCH",
    token,
  });
};
