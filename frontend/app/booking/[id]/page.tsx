"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  MapPin,
  User,
  Users,
} from "lucide-react";

import {
  getMyBookingById,
  type Booking,
} from "../../components/lib/api/booking";
import { useAuth } from "../../components/lib/auth/AuthProvider";

export default function BookingDetailsPage(): React.ReactElement | null {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { user, token, isLoading, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              : "Unable to load booking details.",
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

  if (isLoading || loading) {
    return <BookingDetailsSkeleton />;
  }

  if (!isAuthenticated || !user || user.role === "admin") {
    return null;
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/bookings"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85] hover:text-[#6689A5]"
          >
            <ArrowLeft size={17} />
            Back to bookings
          </Link>

          <section className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="font-[var(--font-fredoka)] text-2xl font-semibold text-red-800">
              Booking not found
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error || "We could not find this booking."}
            </p>

            <Link
              href="/bookings"
              className="mt-6 inline-flex rounded-xl bg-[#526F85] px-5 py-3 text-sm font-bold text-white hover:bg-[#6689A5]"
            >
              Back to My Bookings
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85] transition hover:text-[#6689A5]"
        >
          <ArrowLeft size={17} />
          Back to My Bookings
        </Link>

        <section className="overflow-hidden rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] shadow-sm">
          <div className="border-b border-[#D6DADB] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6689A5]">
                  Booking Details
                </p>

                <h1 className="mt-2 font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640]">
                  {booking.hostel.name}
                </h1>

                {booking.hostel.address ? (
                  <div className="mt-3 flex items-start gap-2 text-sm text-[#667680]">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-[#6689A5]"
                    />
                    <span>{booking.hostel.address}</span>
                  </div>
                ) : null}
              </div>

              <BookingStatus status={booking.status} />
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <DetailCard
              icon={<CalendarDays size={19} />}
              label="Check-in"
              value={formatDate(booking.checkInDate)}
            />

            <DetailCard
              icon={<CalendarDays size={19} />}
              label="Check-out"
              value={formatDate(booking.checkOutDate)}
            />

            <DetailCard
              icon={<Users size={19} />}
              label="Guests"
              value={
                booking.guests +
                (booking.guests === 1 ? " guest" : " guests")
              }
            />

            <DetailCard
              icon={<IndianRupee size={19} />}
              label="Monthly Rent"
              value={formatCurrency(booking.monthlyRent)}
            />
          </div>

          <div className="border-t border-[#D6DADB] px-6 py-6 sm:px-8">
            <h2 className="font-[var(--font-fredoka)] text-xl font-semibold text-[#263640]">
              Hostel Information
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Hostel Type"
                value={booking.hostel.type || "Not specified"}
              />

              <InfoItem
                label="City"
                value={booking.hostel.city || "Not specified"}
              />

              <InfoItem
                label="Area"
                value={booking.hostel.area || "Not specified"}
              />

              <InfoItem
                label="Monthly Rent"
                value={formatCurrency(booking.hostel.monthlyRent)}
              />
            </div>
          </div>

          <div className="border-t border-[#D6DADB] px-6 py-6 sm:px-8">
            <h2 className="font-[var(--font-fredoka)] text-xl font-semibold text-[#263640]">
              Hostel Contact
            </h2>

            <div className="mt-4 rounded-2xl bg-[#E8ECF3] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D3C8B8]">
                  <User size={19} className="text-[#526F85]" />
                </div>

                <div>
                  <p className="font-semibold text-[#263640]">
                    {booking.owner.name}
                  </p>

                  <p className="text-sm text-[#667680]">
                    {booking.owner.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {booking.rejectionReason ? (
            <div className="border-t border-red-200 bg-red-50 px-6 py-6 sm:px-8">
              <h2 className="font-[var(--font-fredoka)] text-lg font-semibold text-red-800">
                Rejection Reason
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {booking.rejectionReason}
              </p>
            </div>
          ) : null}

          {booking.cancellationReason ? (
            <div className="border-t border-[#D6DADB] bg-[#E8ECF3] px-6 py-6 sm:px-8">
              <h2 className="font-[var(--font-fredoka)] text-lg font-semibold text-[#263640]">
                Cancellation Reason
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#667680]">
                {booking.cancellationReason}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-[#D6DADB] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs text-[#667680]">Booking requested</p>

              <p className="mt-1 text-sm font-semibold text-[#263640]">
                {booking.createdAt
                  ? formatDate(booking.createdAt)
                  : "Not available"}
              </p>
            </div>

            {booking.status === "pending" ||
            booking.status === "approved" ? (
              <Link
                href={"/bookings/" + bookingId + "/cancel"}
                className="rounded-xl border border-red-300 px-5 py-3 text-center text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                Cancel Booking
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailCard({
  icon,
  label,
  value,
}: DetailCardProps): React.ReactElement {
  return (
    <div className="rounded-2xl bg-[#E8ECF3] p-5">
      <div className="flex items-center gap-2 text-[#6689A5]">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-3 font-[var(--font-fredoka)] text-lg font-semibold text-[#263640]">
        {value}
      </p>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps): React.ReactElement {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#667680]">
        {label}
      </p>

      <p className="mt-1 font-semibold text-[#263640]">{value}</p>
    </div>
  );
}

interface BookingStatusProps {
  status: Booking["status"];
}

function BookingStatus({
  status,
}: BookingStatusProps): React.ReactElement {
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
        "w-fit shrink-0 rounded-full px-4 py-2 text-xs font-bold " +
        config.className
      }
    >
      {config.label}
    </span>
  );
}

function BookingDetailsSkeleton(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 h-5 w-36 animate-pulse rounded bg-[#CBD3D6]" />

        <section className="animate-pulse overflow-hidden rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9]">
          <div className="border-b border-[#D6DADB] p-8">
            <div className="h-3 w-32 rounded bg-[#CBD3D6]" />
            <div className="mt-4 h-9 w-64 rounded-xl bg-[#CBD3D6]" />
            <div className="mt-4 h-4 w-72 rounded bg-[#CBD3D6]" />
          </div>

          <div className="grid gap-4 p-8 sm:grid-cols-2">
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
          </div>

          <div className="border-t border-[#D6DADB] p-8">
            <div className="h-6 w-48 rounded bg-[#CBD3D6]" />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
              <SkeletonLine />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SkeletonBox(): React.ReactElement {
  return <div className="h-24 rounded-2xl bg-[#CBD3D6]" />;
}

function SkeletonLine(): React.ReactElement {
  return <div className="h-12 rounded-xl bg-[#CBD3D6]" />;
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