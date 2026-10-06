"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  MapPin,
  Users,
} from "lucide-react";

import {
  createBooking,
  type CreateBookingData,
} from "../../components/lib/api/booking";
import { getHostelById, type Hostel } from "../../components/lib/api/hostel";
import { useAuth } from "../../components/lib/auth/AuthProvider";

export default function CreateBookingPage(): React.ReactElement | null {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, token, isLoading, isAuthenticated } = useAuth();

  const hostelId = searchParams.get("hostel");

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loadingHostel, setLoadingHostel] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("1");

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

    if (!token || !hostelId) {
      return;
    }

    let cancelled = false;

    const loadHostel = async (): Promise<void> => {
      try {
        setLoadingHostel(true);
        setError("");

        const response = await getHostelById(hostelId);

        if (!cancelled) {
          setHostel(response.data);
        }
      } catch (requestError: unknown) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load hostel details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingHostel(false);
        }
      }
    };

    void loadHostel();

    return () => {
      cancelled = true;
    };
  }, [isLoading, isAuthenticated, user, token, hostelId, router]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!token || !hostelId || submitting) {
      return;
    }

    setError("");

    if (!checkInDate || !checkOutDate) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    const checkIn = new Date(checkInDate + "T00:00:00");
    const checkOut = new Date(checkOutDate + "T00:00:00");

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      setError("Please select valid dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out date must be after the check-in date.");
      return;
    }

    const guestCount = Number(guests);

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      setError("Guests must be at least 1.");
      return;
    }

    const bookingData: CreateBookingData = {
      hostel: hostelId,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      guests: guestCount,
    };

    try {
      setSubmitting(true);

      const response = await createBooking(token, bookingData);

      const createdBookingId = response.data.id ?? response.data._id;

      if (!createdBookingId) {
        setError("Booking was created, but no booking ID was returned.");
        return;
      }

      router.replace("/bookings/" + createdBookingId);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create your booking.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || loadingHostel) {
    return <CreateBookingSkeleton />;
  }

  if (!isAuthenticated || !user || user.role === "admin") {
    return null;
  }

  if (!hostelId) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <section className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="font-[var(--font-fredoka)] text-2xl font-semibold text-red-800">
              Hostel not selected
            </h1>

            <p className="mt-2 text-sm text-red-700">
              Please select a hostel before creating a booking.
            </p>

            <Link
              href="/moving"
              className="mt-6 inline-flex rounded-xl bg-[#526F85] px-5 py-3 text-sm font-bold text-white"
            >
              Find a Hostel
            </Link>
          </section>
        </div>
      </main>
    );
  }

  if (!hostel) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <section className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="font-[var(--font-fredoka)] text-2xl font-semibold text-red-800">
              Unable to load hostel
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error || "This hostel could not be found."}
            </p>

            <Link
              href="/moving"
              className="mt-6 inline-flex rounded-xl bg-[#526F85] px-5 py-3 text-sm font-bold text-white"
            >
              Back to Hostels
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={"/hostels/" + hostel._id}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85] transition hover:text-[#6689A5]"
        >
          <ArrowLeft size={17} />
          Back to Hostel
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6689A5]">
                CityHop Booking
              </p>

              <h1 className="mt-2 font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640]">
                Book Your Stay
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#667680]">
                Choose your preferred dates and number of guests to send a
                booking request.
              </p>
            </div>

            <form
              onSubmit={(event) => void handleSubmit(event)}
              className="mt-8 space-y-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="check-in"
                    className="mb-2 block text-sm font-bold text-[#263640]"
                  >
                    Check-in date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                    />

                    <input
                      id="check-in"
                      type="date"
                      value={checkInDate}
                      min={getToday()}
                      onChange={(event) => setCheckInDate(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#CBD3D6] bg-white py-3 pl-11 pr-4 text-sm text-[#263640] outline-none transition focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="check-out"
                    className="mb-2 block text-sm font-bold text-[#263640]"
                  >
                    Check-out date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                    />

                    <input
                      id="check-out"
                      type="date"
                      value={checkOutDate}
                      min={checkInDate || getToday()}
                      onChange={(event) => setCheckOutDate(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#CBD3D6] bg-white py-3 pl-11 pr-4 text-sm text-[#263640] outline-none transition focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="guests"
                  className="mb-2 block text-sm font-bold text-[#263640]"
                >
                  Number of guests
                </label>

                <div className="relative">
                  <Users
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                  />

                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max="20"
                    value={guests}
                    onChange={(event) => setGuests(event.target.value)}
                    required
                    className="w-full rounded-xl border border-[#CBD3D6] bg-white py-3 pl-11 pr-4 text-sm text-[#263640] outline-none transition focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm leading-6 text-red-700">{error}</p>
                </div>
              ) : null}

              <div className="rounded-2xl bg-[#E8ECF3] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#667680]">
                  Important
                </p>

                <p className="mt-2 text-sm leading-6 text-[#526F85]">
                  Your booking will initially be submitted as a pending request.
                  The hostel manager must approve it before your booking is
                  confirmed.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || !hostel.isActive}
                className="w-full rounded-xl bg-[#6689A5] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#526F85] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting Booking..." : "Send Booking Request"}
              </button>
            </form>
          </section>

          <aside className="h-fit rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6689A5]">
              Your Selection
            </p>

            <h2 className="mt-2 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
              {hostel.name}
            </h2>

            <div className="mt-3 flex items-start gap-2 text-sm text-[#667680]">
              <MapPin size={17} className="mt-0.5 shrink-0 text-[#6689A5]" />

              <span>
                {hostel.address}, {hostel.area.name}, {hostel.city.name}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-[#E8ECF3] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#667680]">
                Monthly Rent
              </p>

              <div className="mt-1 flex items-center gap-1">
                <IndianRupee size={19} className="text-[#526F85]" />

                <span className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                  {formatCurrency(hostel.monthlyRent)}
                </span>
              </div>
            </div>

            {hostel.securityDeposit !== undefined ? (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-[#D6DADB] px-4 py-3">
                <span className="text-sm text-[#667680]">Security Deposit</span>

                <span className="text-sm font-bold text-[#263640]">
                  {formatCurrency(hostel.securityDeposit)}
                </span>
              </div>
            ) : null}

            <div className="mt-5 border-t border-[#D6DADB] pt-5">
              <p className="text-xs text-[#667680]">Listed by</p>

              <p className="mt-1 font-semibold text-[#263640]">
                {hostel.owner.name}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CreateBookingSkeleton(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 h-5 w-36 animate-pulse rounded bg-[#CBD3D6]" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="animate-pulse rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] p-8">
            <div className="h-3 w-32 rounded bg-[#CBD3D6]" />
            <div className="mt-4 h-9 w-64 rounded-xl bg-[#CBD3D6]" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-[#CBD3D6]" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="h-12 rounded-xl bg-[#CBD3D6]" />
              <div className="h-12 rounded-xl bg-[#CBD3D6]" />
            </div>

            <div className="mt-6 h-12 rounded-xl bg-[#CBD3D6]" />
            <div className="mt-6 h-20 rounded-2xl bg-[#CBD3D6]" />
            <div className="mt-6 h-12 rounded-xl bg-[#CBD3D6]" />
          </section>

          <aside className="h-80 animate-pulse rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9]" />
        </div>
      </div>
    </main>
  );
}

function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
