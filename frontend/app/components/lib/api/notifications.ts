export type NotificationType =
  | "booking_approved"
  | "booking_rejected"
  | "booking_cancelled";

export interface CityHopNotification {
  _id: string;
  recipient: string;
  actor?: {
    _id: string;
    name: string;
  } | null;
  booking?: {
    _id: string;
    status: "pending" | "approved" | "rejected" | "cancelled";
    checkInDate: string;
    checkOutDate: string;
  } | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  success?: boolean;
  message?: string;
  notifications?: CityHopNotification[];
  unreadCount?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function getToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("cityhop_token") || "";
}

async function notificationRequest<T>(
  path: string,
  method: "GET" | "PATCH" = "GET",
): Promise<T> {
  const token = getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!token) {
    throw new Error("Please log in to view notifications.");
  }

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(
    baseUrl.replace(/\/$/, "") + "/notifications" + path,
    {
      method,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      "Expected JSON but received HTML or another response type. " +
        "Check the API URL and backend route. HTTP status: " +
        response.status,
    );
  }

  let data: unknown;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error("The backend returned invalid JSON.");
  }
  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Notification request failed.";

    throw new Error(message);
  }

  return data as T;
}

export function getMyNotifications(page = 1, limit = 10) {
  return notificationRequest<NotificationsResponse>(
    "?page=" + page + "&limit=" + limit,
  );
}

export function markNotificationAsRead(id: string) {
  return notificationRequest<{ notification?: CityHopNotification }>(
    "/" + encodeURIComponent(id) + "/read",
    "PATCH",
  );
}

export function markAllNotificationsAsRead() {
  return notificationRequest<{ modifiedCount?: number }>("/read-all", "PATCH");
}
