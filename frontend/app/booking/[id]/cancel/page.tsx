"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CalendarDays } from "lucide-react";

import {
  cancelMyBooking,
  getMyBookingById,
  type Booking,
} from "../../../components/lib/api/booking";
import { useAuth } from "../../../components/lib/auth/AuthProvider";

export default function CancelBookingPage(): React.ReactElement | null {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { user, token, isLoading, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const bookingId = params.id;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (!token || !bookingId) {
      return;
    }

    let cancelled = false;

    const loadBooking = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyBookingById(token, bookingId);

        if (!cancelled) {
          setBooking(response.data);
        }
      } catch (requestError: unknown) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load booking.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadBooking();

    return () => {
      cancelled = true;
    };
  }, [isLoading, isAuthenticated, user, token, bookingId, router]);

  const handleCancel = async (): Promise<void> => {
    if (!token || !bookingId || cancelling) {
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      const response = await cancelMyBooking(token, bookingId);

      setBooking(response.data);
      setSuccess(response.message || "Booking cancelled successfully.");

      setTimeout(() => {
        router.replace("/bookings/" + bookingId);
      }, 1200);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to cancel this booking.",
      );
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading || loading) {
    return <CancelBookingSkeleton />;
  }

  if (!isAuthenticated || !user || user.role === "admin") {
    return null;
  }

  if (error && !booking) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <Link
            href="/bookings"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85]"
          >
            <ArrowLeft size={17} />
            Back to bookings
          </Link>

          <section className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="font-[var(--font-fredoka)] text-2xl font-semibold text-red-800">
              Unable to load booking
            </h1>

            <p className="mt-2 text-sm text-red-700">{error}</p>
          </section>
        </div>
      </main>
    );
  }

  if (!booking) {
    return null;
  }

  const canCancel =
    booking.status === "pending" || booking.status === "approved";

  if (!canCancel) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <Link
            href={"/bookings/" + bookingId}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85]"
          >
            <ArrowLeft size={17} />
            Back to booking
          </Link>

          <section className="rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8ECF3]">
              <AlertTriangle size={25} className="text-[#526F85]" />
            </div>

            <h1 className="mt-5 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
              This booking cannot be cancelled
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#667680]">
              This booking is already {booking.status} and can no longer be
              cancelled.
            </p>

            <Link
              href={"/bookings/" + bookingId}
              className="mt-6 inline-flex rounded-xl bg-[#526F85] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6689A5]"
            >
              View Booking
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href={"/bookings/" + bookingId}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85] transition hover:text-[#6689A5]"
        >
          <ArrowLeft size={17} />
          Back to booking
        </Link>

        <section className="rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] p-6 shadow-sm sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <AlertTriangle size={30} className="text-red-600" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6689A5]">
              Cancel Booking
            </p>

            <h1 className="mt-2 font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640]">
              Cancel this booking?
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#667680]">
              Are you sure you want to cancel your booking request? This
              action cannot be undone.
            </p>
          </div>

          <div className="mt-7 rounded-2xl bg-[#E8ECF3] p-5">
            <h2 className="font-[var(--font-fredoka)] text-lg font-semibold text-[#263640]">
              {booking.hostel.name}
            </h2>

            {booking.hostel.address ? (
              <p className="mt-2 text-sm text-[#667680]">
                {booking.hostel.address}
              </p>
            ) : null}

            <div className="mt-4 flex items-center gap-2 text-sm text-[#667680]">
              <CalendarDays size={17} className="text-[#6689A5]" />

              <span>
                {formatDate(booking.checkInDate)} —{" "}
                {formatDate(booking.checkOutDate)}
              </span>
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : null}

          {success ? (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700">
                {success}
              </p>
            </div>
          ) : null}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
            <Link
              href={"/bookings/" + bookingId}
              className="flex-1 rounded-xl border border-[#CBD3D6] px-5 py-3 text-center text-sm font-bold text-[#526F85] transition hover:bg-[#E8ECF3]"
            >
              Keep Booking
            </Link>

            <button
              type="button"
              onClick={() => void handleCancel()}
              disabled={cancelling || Boolean(success)}
              className="flex-1 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Booking"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function CancelBookingSkeleton(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 h-5 w-36 animate-pulse rounded bg-[#CBD3D6]" />

        <section className="animate-pulse rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] p-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-[#CBD3D6]" />

          <div className="mx-auto mt-6 h-4 w-32 rounded bg-[#CBD3D6]" />

          <div className="mx-auto mt-3 h-9 w-64 rounded-xl bg-[#CBD3D6]" />

          <div className="mx-auto mt-4 h-4 w-80 max-w-full rounded bg-[#CBD3D6]" />

          <div className="mt-7 h-28 rounded-2xl bg-[#CBD3D6]" />

          <div className="mt-7 h-12 rounded-xl bg-[#CBD3D6]" />
        </section>
      </div>
    </main>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}