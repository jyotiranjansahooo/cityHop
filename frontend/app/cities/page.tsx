"use client";

import {
  ArrowRight,
  Building2,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LocationAutocomplete, {
  type SelectedLocation,
} from "../components/moving/LocationAutocomplete";
import RemoteImage from "../components/ui/RemoteImage";
import Skeleton from "../components/ui/Skeleton";

interface City {
  _id: string;
  name: string;
  state?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

interface CitiesResponse {
  success: boolean;
  cities?: City[];
  data?: City[];
  message?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CitiesPage(): React.ReactElement {
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCityResults = async (
    location: SelectedLocation,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams({
        search: location.name,
      });

      const response = await fetch(
        API_URL + "/cities?" + params.toString(),
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data: CitiesResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load city information.",
        );
      }

      const cityList = data.cities || data.data || [];

      setCities(cityList);
    } catch (requestError) {
      console.error("City loading error:", requestError);

      setCities([]);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load city information right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (location: SelectedLocation): void => {
    setSelectedLocation(location);
    void loadCityResults(location);
  };

  const clearCitySearch = (): void => {
    setSelectedLocation(null);
    setCities([]);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#E8ECF3] text-[#263640]">
      <section className="relative px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#A7BDD3]/40 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#D3C8B8]/40 blur-3xl" />

        <div className="relative mx-auto max-w-[1180px]">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6689A5]/20 bg-[#D6DADB]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#526F85]">
              <MapPin size={13} />
              Explore Odisha
            </p>

            <h1 className="font-[var(--font-fredoka)] text-5xl font-semibold leading-[1.05] tracking-tight text-[#263640] sm:text-6xl lg:text-7xl">
              Find your
              <span className="block text-[#6689A5]">
                next city.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#667680] sm:text-lg">
              Explore cities across Odisha, discover their areas and
              find the information you need before making your next
              move.
            </p>
          </div>

          <div className="relative z-30 mt-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="relative z-30">
              <LocationAutocomplete
                label="Search city"
                placeholder="Search Bhubaneswar, Cuttack, Puri..."
                selectedLocation={selectedLocation}
                onSelect={handleCitySelect}
                onClear={clearCitySearch}
                featureTypes="place,locality,district,region"
              />
            </div>

            <div className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#B9C6D0] bg-[#D6DADB]/80 px-5 text-sm font-bold text-[#526F85]">
              <SlidersHorizontal size={17} />
              Odisha only
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6689A5]">
                City exploration
              </p>

              <h2 className="mt-2 font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640] sm:text-4xl">
                {selectedLocation
                  ? "Explore your selected city"
                  : "Explore Odisha cities"}
              </h2>
            </div>

            {selectedLocation && (
              <span className="hidden rounded-full bg-[#D6DADB] px-4 py-2 text-xs font-bold text-[#667680] sm:block">
                {selectedLocation.name}
              </span>
            )}
          </div>

          {!selectedLocation && !isLoading && (
            <div className="rounded-[28px] border border-[#B9C6D0] bg-[#D6DADB]/70 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                <Search size={27} />
              </div>

              <h3 className="mt-5 font-[var(--font-fredoka)] text-2xl font-semibold">
                Search for a city
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#667680]">
                Search for a city above and select an Odisha
                location from the suggestions.
              </p>
            </div>
          )}

          {isLoading && <CitiesSkeleton />}

          {!isLoading && error && (
            <div className="rounded-[28px] border border-[#B9C6D0] bg-[#D3C8B8] px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8ECF3] text-[#526F85]">
                <Building2 size={24} />
              </div>

              <h3 className="mt-5 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                City information could not be loaded
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#667680]">
                {error}
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            selectedLocation &&
            cities.length === 0 && (
              <div className="rounded-[28px] border border-[#B9C6D0] bg-[#D6DADB]/70 px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                  <MapPin size={24} />
                </div>

                <h3 className="mt-5 font-[var(--font-fredoka)] text-2xl font-semibold">
                  City not available yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#667680]">
                  We do not have city information for this
                  location yet.
                </p>
              </div>
            )}

          {!isLoading && !error && cities.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <CityCard key={city._id} city={city} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

interface CityCardProps {
  city: City;
}

function CityCard({
  city,
}: CityCardProps): React.ReactElement {
  return (
    <Link
      href={"/cities/" + encodeURIComponent(city._id)}
      className="group block"
    >
      <article className="h-full overflow-hidden rounded-[28px] border border-[#B9C6D0] bg-[#D6DADB]/75 transition duration-300 hover:-translate-y-1 hover:border-[#A7BDD3] hover:bg-[#CBD3D6] hover:shadow-[0_24px_50px_rgba(38,54,64,0.10)]">
        <div className="relative h-48 overflow-hidden bg-[#A7BDD3]">
          {city.image ? (
            <RemoteImage
              src={city.image}
              alt={city.name}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E8ECF3]/70 text-[#526F85]">
                <Building2 size={34} />
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-[#E8ECF3]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#526F85] backdrop-blur-sm">
            Odisha
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                {city.name}
              </h3>

              {city.state && (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#667680]">
                  <MapPin size={13} />
                  {city.state}
                </p>
              )}
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A7BDD3] text-[#526F85] transition duration-300 group-hover:bg-[#526F85] group-hover:text-[#E8ECF3]">
              <ArrowRight size={17} />
            </span>
          </div>

          {city.description && (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#667680]">
              {city.description}
            </p>
          )}

          <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#526F85]">
            Explore city
            <ChevronRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

function CitiesSkeleton(): React.ReactElement {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[28px] border border-[#B9C6D0] bg-[#D6DADB]/70"
        >
          <Skeleton className="h-48 w-full rounded-none" />

          <div className="p-6">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="mt-3 h-4 w-24" />
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <Skeleton className="mt-6 h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}