"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  IndianRupee,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

import { getHostelById, type Hostel } from "../../components/lib/api/hostel";
import { useAuth } from "../../components/lib/auth/AuthProvider";

export default function HostelDetailsPage(): React.ReactElement | null {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { user, isAuthenticated } = useAuth();

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hostelId = params.id;

  useEffect(() => {
    if (!hostelId) {
      return;
    }

    let cancelled = false;

    const loadHostel = async (): Promise<void> => {
      try {
        setLoading(true);
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
          setLoading(false);
        }
      }
    };

    void loadHostel();

    return () => {
      cancelled = true;
    };
  }, [hostelId]);

  if (loading) {
    return <HostelDetailsSkeleton />;
  }

  if (!hostel || error) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/moving"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85]"
          >
            <ArrowLeft size={17} />
            Back to hostels
          </Link>

          <section className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h1 className="font-[var(--font-fredoka)] text-2xl font-semibold text-red-800">
              Hostel not found
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error || "This hostel is no longer available."}
            </p>

            <Link
              href="/moving"
              className="mt-6 inline-flex rounded-xl bg-[#526F85] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6689A5]"
            >
              Find Other Hostels
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const canBook = isAuthenticated && user !== null && user.role === "user";

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/moving"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85] transition hover:text-[#6689A5]"
        >
          <ArrowLeft size={17} />
          Back to hostels
        </Link>

        <section className="overflow-hidden rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9] shadow-sm">
          <HostelGallery images={hostel.images} name={hostel.name} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#D3C8B8] px-3 py-1.5 text-xs font-bold capitalize text-[#526F85]">
                    {hostel.type.replace("-", " ")}
                  </span>

                  {hostel.isActive ? (
                    <span className="rounded-full bg-[#CBD3D6] px-3 py-1.5 text-xs font-bold text-[#263640]">
                      Available
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-4 font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640] sm:text-4xl">
                  {hostel.name}
                </h1>

                <div className="mt-3 flex items-start gap-2 text-sm text-[#667680]">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#6689A5]"
                  />

                  <span>
                    {hostel.address}, {hostel.area.name}, {hostel.city.name}
                  </span>
                </div>
              </div>

              <div className="shrink-0 rounded-2xl bg-[#E8ECF3] px-5 py-4 lg:min-w-48">
                <p className="text-xs font-bold uppercase tracking-wider text-[#667680]">
                  Monthly Rent
                </p>

                <p className="mt-1 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                  {formatCurrency(hostel.monthlyRent)}
                </p>

                <p className="text-xs text-[#667680]">per month</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                icon={<BedDouble size={20} />}
                label="Hostel Type"
                value={formatType(hostel.type)}
              />

              <InfoCard
                icon={<IndianRupee size={20} />}
                label="Security Deposit"
                value={
                  hostel.securityDeposit !== undefined
                    ? formatCurrency(hostel.securityDeposit)
                    : "Not specified"
                }
              />

              <InfoCard
                icon={<MapPin size={20} />}
                label="Area"
                value={hostel.area.name}
              />

              <InfoCard
                icon={<ShieldCheck size={20} />}
                label="Status"
                value={hostel.isActive ? "Available" : "Unavailable"}
              />
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                {hostel.description ? (
                  <section>
                    <h2 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                      About this hostel
                    </h2>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#667680]">
                      {hostel.description}
                    </p>
                  </section>
                ) : null}

                <section className="mt-8">
                  <h2 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                    Amenities
                  </h2>

                  {hostel.amenities.length > 0 ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {hostel.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-3 rounded-xl bg-[#E8ECF3] px-4 py-3"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D3C8B8]">
                            <Check size={15} className="text-[#526F85]" />
                          </span>

                          <span className="text-sm font-semibold capitalize text-[#263640]">
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-[#667680]">
                      No amenities have been listed.
                    </p>
                  )}
                </section>

                <section className="mt-8">
                  <h2 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                    Location
                  </h2>

                  <div className="mt-4 overflow-hidden rounded-2xl bg-[#E8ECF3] p-5">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="mt-0.5 text-[#6689A5]" />

                      <div>
                        <p className="font-semibold text-[#263640]">
                          {hostel.address}
                        </p>

                        <p className="mt-1 text-sm text-[#667680]">
                          {hostel.area.name}, {hostel.city.name}
                        </p>

                        <p className="mt-2 text-xs text-[#667680]">
                          Coordinates: {hostel.latitude}, {hostel.longitude}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="h-fit rounded-3xl border border-[#CBD3D6] bg-[#E8ECF3] p-5">
                <h2 className="font-[var(--font-fredoka)] text-xl font-semibold text-[#263640]">
                  Interested in this hostel?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#667680]">
                  Send a booking request with your preferred dates and number of
                  guests.
                </p>

                <div className="mt-5 rounded-2xl bg-[#F7F8F9] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D3C8B8]">
                      <User size={18} className="text-[#526F85]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#667680]">Listed by</p>

                      <p className="font-semibold text-[#263640]">
                        {hostel.owner.name}
                      </p>
                    </div>
                  </div>
                </div>

                {canBook ? (
                  <Link
                    href={"/bookings/create?hostel=" + hostel._id}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6689A5] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#526F85]"
                  >
                    <CalendarDays size={18} />
                    Book This Hostel
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#6689A5] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#526F85]"
                  >
                    Login to Book
                  </Link>
                )}

                <p className="mt-3 text-center text-xs leading-5 text-[#667680]">
                  You can review your booking request from your dashboard after
                  submitting it.
                </p>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

interface HostelGalleryProps {
  images: Hostel["images"];
  name: string;
}

function HostelGallery({
  images,
  name,
}: HostelGalleryProps): React.ReactElement {
  const [selectedImage, setSelectedImage] = useState(0);

  const selected = images[selectedImage]?.url || images[0]?.url || "";

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center bg-[#CBD3D6] text-[#667680] sm:h-96">
        <BedDouble size={48} />
      </div>
    );
  }

  return (
    <div className="bg-[#CBD3D6]">
      <div className="relative h-72 sm:h-96">
        <img src={selected} alt={name} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto p-3">
          {images.map((image, index) => (
            <button
              key={image.publicId}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={
                "h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition " +
                (selectedImage === index
                  ? "border-[#526F85]"
                  : "border-transparent")
              }
            >
              <img
                src={image.url}
                alt={name + " image " + (index + 1)}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps): React.ReactElement {
  return (
    <div className="rounded-2xl bg-[#E8ECF3] p-4">
      <div className="flex items-center gap-2 text-[#6689A5]">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 font-semibold text-[#263640]">{value}</p>
    </div>
  );
}

function HostelDetailsSkeleton(): React.ReactElement {
  return (
    <main className="min-h-screen bg-[#E8ECF3] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 h-5 w-36 animate-pulse rounded bg-[#CBD3D6]" />

        <section className="overflow-hidden rounded-3xl border border-[#CBD3D6] bg-[#F7F8F9]">
          <div className="h-72 animate-pulse bg-[#CBD3D6] sm:h-96" />

          <div className="animate-pulse p-6 sm:p-8">
            <div className="h-4 w-28 rounded bg-[#CBD3D6]" />
            <div className="mt-4 h-10 w-72 rounded-xl bg-[#CBD3D6]" />
            <div className="mt-4 h-5 w-96 max-w-full rounded bg-[#CBD3D6]" />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            <div className="mt-10 h-7 w-52 rounded bg-[#CBD3D6]" />
            <div className="mt-4 h-24 rounded-2xl bg-[#CBD3D6]" />
          </div>
        </section>
      </div>
    </main>
  );
}

function SkeletonCard(): React.ReactElement {
  return <div className="h-24 rounded-2xl bg-[#CBD3D6]" />;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatType(type: Hostel["type"]): string {
  if (type === "co-living") {
    return "Co-living";
  }

  if (type === "boys") {
    return "Boys";
  }

  return "Girls";
}
