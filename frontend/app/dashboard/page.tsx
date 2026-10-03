"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Map,
  MapPin,
  Train,
  UserRound,
} from "lucide-react";

import { useAuth } from "../components/lib/auth/AuthProvider";
import Skeleton from "../components/ui/Skeleton";
import {
  getMyBookings,
  type Booking,
} from "../components/lib/api/booking";

export default function DashboardPage(): React.ReactElement {
  const router = useRouter();

  const {
    user,
    token,
    isLoading,
    isAuthenticated,
  } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(true);
  const [bookingsError, setBookingsError] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

useEffect(() => {
  if (
    !token ||
    !isAuthenticated ||
    !user ||
    user.role !== "user"
  ) {
    return;
  }

  let cancelled = false;

  const loadBookings = async (): Promise<void> => {
    try {
      setBookingsLoading(true);
      setBookingsError("");

      const response = await getMyBookings(token);

      if (!cancelled) {
        setBookings(response.data);
      }
    } catch (error: unknown) {
      if (!cancelled) {
        setBookingsError(
          error instanceof Error
            ? error.message
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
}, [token, isAuthenticated, user]);

  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-10 w-64" />

          <Skeleton className="mt-4 h-5 w-96 max-w-full" />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>

          <Skeleton className="mt-7 h-72" />
        </div>
      </main>
    );
  }

  if (user.role === "admin") {
    router.replace("/admin");

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#E8ECF3]">
        <Skeleton className="h-10 w-10 rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-5 py-28 text-[#263640] sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome section */}
        <section className="rounded-[32px] border border-[#CBD3D6] bg-[#D6DADB] p-7 shadow-[0_20px_60px_rgba(82,111,133,0.10)] sm:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#6689A5]">
                Your CityHop
              </p>

              <h1 className="mt-2 font-[var(--font-fredoka)] text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
                Welcome, {user.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667680] sm:text-base">
                Explore cities, compare areas, discover places to stay,
                and plan your next move.
              </p>
            </div>

            <Link
              href="/cities"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6689A5] px-5 text-sm font-semibold text-[#E8ECF3] transition hover:bg-[#526F85]"
            >
              Explore cities
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-7 grid gap-5 md:grid-cols-3">
          <DashboardAction
            href="/moving"
            icon={<MapPin size={22} />}
            title="Plan your move"
            description="Choose where you are moving from and where you want to go."
          />

          <DashboardAction
            href="/transport"
            icon={<Train size={22} />}
            title="Find transport"
            description="Search transport options between your selected locations."
          />

          <DashboardAction
            href="/cities"
            icon={<Map size={22} />}
            title="Explore cities"
            description="Discover cities and explore available areas and stays."
          />
        </section>

        {/* Profile + getting started */}
        <section className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">

          {/* Profile */}
          <div className="rounded-[28px] border border-[#CBD3D6] bg-[#D6DADB] p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-[var(--font-fredoka)] text-xl font-semibold">
                  Your profile
                </h2>

                <p className="text-sm text-[#667680]">
                  Account information
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ProfileItem
                label="Name"
                value={user.name}
              />

              <ProfileItem
                label="Email"
                value={user.email}
              />

              <ProfileItem
                label="Account type"
                value="User"
              />

              <ProfileItem
                label="Account status"
                value={user.isActive ? "Active" : "Inactive"}
              />
            </div>
          </div>

          {/* Getting started */}
          <div className="rounded-[28px] border border-[#CBD3D6] bg-[#D6DADB] p-7">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#6689A5]">
              Getting started
            </p>

            <h2 className="mt-2 font-[var(--font-fredoka)] text-xl font-semibold">
              Plan your relocation
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667680]">
              Start by selecting your destination and exploring what
              the city has to offer.
            </p>

            <Link
              href="/moving"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#526F85] transition hover:text-[#6689A5]"
            >
              Start planning
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Recent bookings */}
        <section className="mt-7 rounded-[28px] border border-[#CBD3D6] bg-[#D6DADB] p-7">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#6689A5]">
                Bookings
              </p>

              <h2 className="mt-2 font-[var(--font-fredoka)] text-2xl font-semibold">
                Your recent bookings
              </h2>

              <p className="mt-2 text-sm text-[#667680]">
                Your latest hostel booking activity.
              </p>
            </div>

            {bookings.length > 0 ? (
              <span className="rounded-full bg-[#A7BDD3] px-3 py-1.5 text-xs font-semibold text-[#526F85]">
                {bookings.length} booking
                {bookings.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>

          {/* Booking loading */}
          {bookingsLoading ? (
            <div className="mt-6 space-y-4">
              <BookingSkeleton />
              <BookingSkeleton />
              <BookingSkeleton />
            </div>
          ) : null}

          {/* Booking error */}
          {!bookingsLoading && bookingsError ? (
            <div className="mt-6 rounded-2xl border border-[#B9AFA3] bg-[#D3C8B8]/60 p-5">
              <p className="text-sm font-semibold text-[#526F85]">
                Unable to load bookings
              </p>

              <p className="mt-1 text-sm leading-6 text-[#667680]">
                {bookingsError}
              </p>
            </div>
          ) : null}

          {/* No bookings */}
          {!bookingsLoading &&
          !bookingsError &&
          bookings.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6]/50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                <CalendarDays size={22} />
              </div>

              <h3 className="mt-4 font-[var(--font-fredoka)] text-lg font-semibold">
                No bookings yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667680]">
                You haven`t made a hostel booking yet. Explore cities
                and find a place that works for you.
              </p>

              <Link
                href="/cities"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#6689A5] px-5 py-3 text-sm font-semibold text-[#E8ECF3] transition hover:bg-[#526F85]"
              >
                Explore cities
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : null}

          {/* Bookings */}
          {!bookingsLoading &&
          !bookingsError &&
          bookings.length > 0 ? (
            <div className="mt-6 space-y-4">
              {bookings.slice(0, 3).map((booking) => (
                <BookingCard
                  key={booking._id ?? booking.id}
                  booking={booking}
                />
              ))}
            </div>
          ) : null}

          {/* More bookings indicator */}
          {!bookingsLoading && bookings.length > 3 ? (
            <p className="mt-5 text-center text-xs text-[#7A878F]">
              Showing your 3 most recent bookings.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}

interface DashboardActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function DashboardAction({
  href,
  icon,
  title,
  description,
}: DashboardActionProps): React.ReactElement {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-[#CBD3D6] bg-[#D6DADB] p-7 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(82,111,133,0.12)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
        {icon}
      </div>

      <h2 className="mt-5 font-[var(--font-fredoka)] text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#667680]">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#526F85]">
        Open

        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

interface ProfileItemProps {
  label: string;
  value: string;
}

function ProfileItem({
  label,
  value,
}: ProfileItemProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6]/60 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A878F]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#263640]">
        {value}
      </p>
    </div>
  );
}

interface BookingCardProps {
  booking: Booking;
}

function BookingCard({
  booking,
}: BookingCardProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6]/50 p-5">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A7BDD3] text-[#526F85]">
              <MapPin size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-[var(--font-fredoka)] text-lg font-semibold text-[#263640]">
                {booking.hostel.name}
              </h3>

              <p className="mt-1 truncate text-sm text-[#667680]">
                {booking.hostel.address ?? "Address unavailable"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#667680]">
            <span>
              Check-in:{" "}
              <strong className="font-semibold text-[#526F85]">
                {formatDate(booking.checkInDate)}
              </strong>
            </span>

            <span>
              Check-out:{" "}
              <strong className="font-semibold text-[#526F85]">
                {formatDate(booking.checkOutDate)}
              </strong>
            </span>

            <span>
              Guests:{" "}
              <strong className="font-semibold text-[#526F85]">
                {booking.guests}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
          <span
            className={
              "rounded-full px-3 py-1.5 text-xs font-semibold capitalize " +
              getBookingStatusClass(booking.status)
            }
          >
            {booking.status}
          </span>

          <p className="text-sm font-semibold text-[#526F85]">
            ₹{booking.monthlyRent.toLocaleString("en-IN")}
            <span className="ml-1 text-xs font-normal text-[#7A878F]">
              / month
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function BookingSkeleton(): React.ReactElement {
  return (
    <div className="rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6]/40 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-start gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />

          <div className="flex-1">
            <Skeleton className="h-5 w-48 max-w-full" />
            <Skeleton className="mt-2 h-4 w-64 max-w-full" />
            <Skeleton className="mt-4 h-3 w-72 max-w-full" />
          </div>
        </div>

        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getBookingStatusClass(
  status: Booking["status"],
): string {
  if (status === "approved") {
    return "bg-[#B8CCBC] text-[#3F6049]";
  }

  if (status === "rejected") {
    return "bg-[#D8BCB8] text-[#744D49]";
  }

  if (status === "cancelled") {
    return "bg-[#CBD3D6] text-[#667680]";
  }

  return "bg-[#D3C8B8] text-[#665A4E]";
}