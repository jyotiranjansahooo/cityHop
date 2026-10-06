"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Users, IndianRupee } from "lucide-react";

import { getMyBookings, type Booking } from "../components/lib/api/booking";
import { useAuth } from "../components/lib/auth/AuthProvider";

export default function BookingsPage(): React.ReactElement | null {
  const router = useRouter();
  const { user, token, isLoading, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [error, setError] = useState("");

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

    if (!token) {
      return;
    }

    let cancelled = false;

    const loadBookings = async (): Promise<void> => {
      try {
        setBookingsLoading(true);
        setError("");

        const response = await getMyBookings(token);

        if (!cancelled) {
          setBookings(response.data);
        }
      } catch (requestError: unknown) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load your bookings.",
          );
        }
      } finally {
        if (!cancelled) {
          setBookingsLoading(false);
        }
      }
    };

    void loadBookings();

    return () => {
      cancelled = true;
    };
  }, [isLoading, isAuthenticated, user, token, router]);

  if (isLoading || bookingsLoading) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="h-10 w-56 animate-pulse rounded-xl bg-[#CBD3D6]" />
            <div className="mt-3 h-5 w-80 animate-pulse rounded-lg bg-[#CBD3D6]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user || user.role === "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#6689A5]">
            CityHop
          </p>

          <h1 className="font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640] sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 max-w-2xl text-[#667680]">
            View and manage your hostel booking requests in one place.
          </p>
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-[var(--font-fredoka)] text-xl font-semibold text-red-800">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[#526F85] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#6689A5]"
            >
              Try again
            </button>
          </section>
        ) : bookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#667680]">
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"}
              </p>

              <Link
                href="/moving"
                className="rounded-xl bg-[#6689A5] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#526F85]"
              >
                Find a Hostel
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {bookings.map((booking) => (
                <BookingCard key={getBookingId(booking)} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

interface BookingCardProps {
  booking: Booking;
}

function BookingCard({ booking }: BookingCardProps): React.ReactElement {
  const bookingId = getBookingId(booking);

  return (
    <article className="overflow-hidden rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#6689A5]">
              Hostel
            </p>

            <h2 className="font-[var(--font-fredoka)] text-xl font-semibold text-[#263640]">
              {booking.hostel.name}
            </h2>
          </div>

          <BookingStatus status={booking.status} />
        </div>

        <div className="space-y-3 text-sm text-[#667680]">
          {booking.hostel.address ? (
            <InfoRow
              icon={<MapPin size={17} />}
              text={booking.hostel.address}
            />
          ) : null}

          <InfoRow
            icon={<CalendarDays size={17} />}
            text={
              formatDate(booking.checkInDate) +
              " — " +
              formatDate(booking.checkOutDate)
            }
          />

          <InfoRow
            icon={<Users size={17} />}
            text={
              booking.guests + (booking.guests === 1 ? " guest" : " guests")
            }
          />

          <InfoRow
            icon={<IndianRupee size={17} />}
            text={formatCurrency(booking.monthlyRent) + " / month"}
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#D6DADB] pt-4">
          <div>
            <p className="text-xs text-[#667680]">Requested</p>
            <p className="mt-1 text-sm font-semibold text-[#263640]">
              {booking.createdAt
                ? formatDate(booking.createdAt)
                : "Not available"}
            </p>
          </div>

          {bookingId ? (
            <Link
              href={"/bookings/" + bookingId}
              className="rounded-xl border border-[#6689A5] px-4 py-2.5 text-sm font-bold text-[#526F85] transition hover:bg-[#6689A5] hover:text-white"
            >
              View Details
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

interface BookingStatusProps {
  status: Booking["status"];
}

function BookingStatus({ status }: BookingStatusProps): React.ReactElement {
  const statusConfig: Record<
    Booking["status"],
    {
      label: string;
      className: string;
    }
  > = {
    pending: {
      label: "Pending",
      className: "bg-[#D3C8B8] text-[#526F85]",
    },
    approved: {
      label: "Approved",
      className: "bg-[#CBD3D6] text-[#263640]",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-[#E8ECF3] text-[#667680]",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold " +
        config.className
      }
    >
      {config.label}
    </span>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  text: string;
}

function InfoRow({ icon, text }: InfoRowProps): React.ReactElement {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-[#6689A5]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function EmptyBookings(): React.ReactElement {
  return (
    <section className="rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D3C8B8]">
        <CalendarDays size={28} className="text-[#526F85]" />
      </div>

      <h2 className="mt-5 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
        No bookings yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667680]">
        You have not made any hostel booking requests yet. Find a place in
        Odisha and send your first booking request.
      </p>

      <Link
        href="/moving"
        className="mt-6 inline-flex rounded-xl bg-[#6689A5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#526F85]"
      >
        Find a Hostel
      </Link>
    </section>
  );
}

function BookingSkeleton(): React.ReactElement {
  return (
    <div className="animate-pulse rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="h-3 w-16 rounded bg-[#CBD3D6]" />
          <div className="mt-3 h-6 w-40 rounded-lg bg-[#CBD3D6]" />
        </div>

        <div className="h-7 w-20 rounded-full bg-[#CBD3D6]" />
      </div>

      <div className="mt-6 space-y-4">
        <div className="h-4 w-48 rounded bg-[#CBD3D6]" />
        <div className="h-4 w-56 rounded bg-[#CBD3D6]" />
        <div className="h-4 w-28 rounded bg-[#CBD3D6]" />
        <div className="h-4 w-36 rounded bg-[#CBD3D6]" />
      </div>

      <div className="mt-6 border-t border-[#D6DADB] pt-4">
        <div className="h-4 w-24 rounded bg-[#CBD3D6]" />
      </div>
    </div>
  );
}

function getBookingId(booking: Booking): string {
  return booking.id ?? booking._id ?? "";
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
