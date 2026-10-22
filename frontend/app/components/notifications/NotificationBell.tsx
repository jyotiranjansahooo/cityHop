"use client";

import { useCallback, useState } from "react";
import { Bell, CheckCheck, LoaderCircle, X } from "lucide-react";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type CityHopNotification,
} from "../lib/api/notifications";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<CityHopNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await getMyNotifications(1, 10);
      setNotifications(result.notifications || []);
      setUnreadCount(result.unreadCount || 0);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to load notifications.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);


  async function handleMarkRead(id: string) {
    try {
      await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to update notification.",
      );
    }
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) {
      return;
    }

    setIsMarkingAll(true);
    setError("");

    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to update notifications.",
      );
    } finally {
      setIsMarkingAll(false);
    }
  }

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => {
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);

          if (nextOpen) {
            void loadNotifications();
          }
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => void handleMarkAllRead()}
                disabled={unreadCount === 0 || isMarkingAll}
                title="Mark all as read"
                aria-label="Mark all as read"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isMarkingAll ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <CheckCheck size={17} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {error && (
            <div className="m-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
              <button
                type="button"
                onClick={() => void loadNotifications()}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          <div className="max-h-[26rem] overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm text-gray-500">
                <LoaderCircle size={18} className="animate-spin" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Bell size={28} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">You’re all caught up</p>
                <p className="mt-1 text-sm text-gray-500">
                  Booking updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={
                    "border-b border-gray-100 px-4 py-4 transition last:border-b-0 " +
                    (notification.isRead ? "bg-white" : "bg-teal-50/70")
                  }
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={
                        "mt-1 h-2.5 w-2.5 shrink-0 rounded-full " +
                        (notification.isRead ? "bg-gray-300" : "bg-teal-600")
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {formatDate(notification.createdAt)}
                      </p>

                      {notification.booking && (
                        <p className="mt-1 text-xs text-gray-500">
                          Booking status:{" "}
                          <span className="font-medium capitalize">
                            {notification.booking.status}
                          </span>
                        </p>
                      )}

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => void handleMarkRead(notification._id)}
                          className="mt-2 text-xs font-semibold text-teal-700 hover:text-teal-900"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => void loadNotifications()}
              disabled={isLoading}
              className="w-full rounded-lg py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 disabled:opacity-50"
            >
              Refresh notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
