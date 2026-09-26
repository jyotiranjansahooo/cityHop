"use client";

import {
  ArrowRight,
  Bus,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Navigation,
  Search,
  TrainFront,
} from "lucide-react";
import { useState } from "react";
import LocationAutocomplete, {
  type SelectedLocation,
} from "../components/moving/LocationAutocomplete";

type TransportMode = "bus" | "train";

interface TransportSearch {
  from: SelectedLocation;
  destination: SelectedLocation;
  date: string;
  mode: TransportMode;
}

export default function TransportPage(): React.ReactElement {
  const [mode, setMode] =
    useState<TransportMode>("bus");

  const [fromLocation, setFromLocation] =
    useState<SelectedLocation | null>(null);

  const [
    destinationLocation,
    setDestinationLocation,
  ] = useState<SelectedLocation | null>(
    null,
  );

  const [date, setDate] =
    useState("");

  const [isSearching, setIsSearching] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  const [searchData, setSearchData] =
    useState<TransportSearch | null>(
      null,
    );

  const [error, setError] =
    useState("");

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    setError("");

    if (!fromLocation) {
      setError(
        "Please select your starting location from the suggestions.",
      );
      return;
    }

    if (!destinationLocation) {
      setError(
        "Please select your destination from the suggestions.",
      );
      return;
    }

    if (
      fromLocation.placeId ===
      destinationLocation.placeId
    ) {
      setError(
        "Starting location and destination cannot be the same.",
      );
      return;
    }

    if (!date) {
      setError(
        "Please select your travel date.",
      );
      return;
    }

    const search: TransportSearch = {
      from: fromLocation,
      destination: destinationLocation,
      date,
      mode,
    };

    setSearchData(search);
    setIsSearching(true);
    setHasSearched(false);

    window.setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 700);
  };

  return (
    <main className="min-h-screen bg-[#E8ECF3] text-[#263640]">
      <section className="relative z-20 px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#A7BDD3]/40 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 top-72 h-64 w-64 rounded-full bg-[#D3C8B8]/45 blur-3xl" />

        <div className="relative mx-auto max-w-[1180px]">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6689A5]/20 bg-[#D6DADB]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#526F85]">
              <Navigation size={13} />
              Odisha transport
            </p>

            <h1 className="font-[var(--font-fredoka)] text-5xl font-semibold leading-[1.05] tracking-tight text-[#263640] sm:text-6xl lg:text-7xl">
              Get there
              <span className="block text-[#6689A5]">
                without the guesswork.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#667680] sm:text-lg">
              Search real transport routes
              between locations in Odisha and
              compare available bus and train
              journeys.
            </p>
          </div>

          <div className="mt-12 rounded-[30px] border border-[#B9C6D0] bg-[#D6DADB]/80 p-4 shadow-[0_25px_70px_rgba(38,54,64,0.10)] backdrop-blur-xl sm:p-6">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("bus");
                  setHasSearched(false);
                }}
                className={
                  "flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition " +
                  (mode === "bus"
                    ? "bg-[#526F85] text-[#E8ECF3] shadow-md"
                    : "bg-[#E8ECF3] text-[#667680] hover:bg-[#CBD3D6]")
                }
              >
                <Bus size={17} />
                Bus
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("train");
                  setHasSearched(false);
                }}
                className={
                  "flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition " +
                  (mode === "train"
                    ? "bg-[#526F85] text-[#E8ECF3] shadow-md"
                    : "bg-[#E8ECF3] text-[#667680] hover:bg-[#CBD3D6]")
                }
              >
                <TrainFront size={17} />
                Train
              </button>
            </div>

            <form
              onSubmit={handleSearch}
              className="grid gap-4 lg:grid-cols-[1fr_56px_1fr_190px_auto]"
            >
              <LocationAutocomplete
                label="From"
                placeholder="Search your starting location"
                selectedLocation={
                  fromLocation
                }
                onSelect={
                  setFromLocation
                }
                onClear={() =>
                  setFromLocation(null)
                }
                allowCurrentLocation
              />

              <div className="hidden items-end justify-center pb-2 lg:flex">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#A7BDD3] text-[#526F85]">
                  <ArrowRight size={18} />
                </div>
              </div>

              <LocationAutocomplete
                label="To"
                placeholder="Search your destination"
                selectedLocation={
                  destinationLocation
                }
                onSelect={
                  setDestinationLocation
                }
                onClear={() =>
                  setDestinationLocation(
                    null,
                  )
                }
              />

              <div>
                <label
                  htmlFor="transport-date"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#667680]"
                >
                  Travel date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                  />

                  <input
                    id="transport-date"
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(
                        event.target.value,
                      )
                    }
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    className="h-14 w-full rounded-2xl border border-[#B9C6D0] bg-[#E8ECF3] pl-11 pr-4 text-sm font-semibold text-[#263640] outline-none transition focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#526F85] px-6 text-sm font-bold text-[#E8ECF3] shadow-lg shadow-[#526F85]/20 transition hover:-translate-y-0.5 hover:bg-[#3F596C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search size={18} />

                  {isSearching
                    ? "Searching..."
                    : "Search"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl bg-[#D3C8B8] px-4 py-3 text-sm font-semibold text-[#526F85]">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          {!hasSearched &&
            !isSearching && (
              <div className="grid gap-5 md:grid-cols-3">
                <TransportInfoCard
                  icon={
                    <MapPin size={20} />
                  }
                  title="Choose your route"
                  description="Search and select real locations from the suggestions."
                />

                <TransportInfoCard
                  icon={
                    mode === "bus" ? (
                      <Bus size={20} />
                    ) : (
                      <TrainFront
                        size={20}
                      />
                    )
                  }
                  title="Select transport"
                  description="Switch between bus and train depending on your journey."
                />

                <TransportInfoCard
                  icon={
                    <Clock3 size={20} />
                  }
                  title="Plan ahead"
                  description="Select your travel date before checking available journeys."
                />
              </div>
            )}

          {isSearching && (
            <TransportResultsSkeleton />
          )}

          {hasSearched &&
            !isSearching &&
            searchData && (
              <section>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6689A5]">
                      Search results
                    </p>

                    <h2 className="mt-2 font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640]">
                      {mode === "bus"
                        ? "Bus"
                        : "Train"}{" "}
                      journeys
                    </h2>
                  </div>

                  <span className="hidden rounded-full bg-[#D6DADB] px-4 py-2 text-xs font-bold text-[#667680] sm:block">
                    {searchData.from.name}
                    {" → "}
                    {
                      searchData
                        .destination.name
                    }
                  </span>
                </div>

                <div className="rounded-[28px] border border-[#B9C6D0] bg-[#D6DADB]/70 px-6 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                    {mode === "bus" ? (
                      <Bus size={28} />
                    ) : (
                      <TrainFront
                        size={28}
                      />
                    )}
                  </div>

                  <h3 className="mt-5 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                    Transport data
                    connection coming
                    next
                  </h3>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#667680]">
                    Your real route has been
                    selected successfully.
                    CityHop still needs a
                    transport data provider
                    before it can display live
                    journeys, fares, schedules,
                    and availability.
                  </p>

                  <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                    <LocationSummary
                      title="From"
                      location={
                        searchData.from
                      }
                    />

                    <LocationSummary
                      title="To"
                      location={
                        searchData.destination
                      }
                    />

                    <div className="rounded-2xl bg-[#E8ECF3] p-4 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667680]">
                        Date
                      </p>

                      <p className="mt-2 text-sm font-bold text-[#263640]">
                        {searchData.date}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E8ECF3] px-4 py-2 text-xs font-bold text-[#526F85]">
                    <span className="h-2 w-2 rounded-full bg-[#6689A5]" />
                    No fake transport
                    results
                  </div>
                </div>
              </section>
            )}
        </div>
      </section>
    </main>
  );
}

interface LocationSummaryProps {
  title: string;
  location: SelectedLocation;
}

function LocationSummary({
  title,
  location,
}: LocationSummaryProps): React.ReactElement {
  return (
    <div className="rounded-2xl bg-[#E8ECF3] p-4 text-left">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#667680]">
        {title}
      </p>

      <p className="mt-2 truncate text-sm font-bold text-[#263640]">
        {location.name}
      </p>

      <p className="mt-1 truncate text-xs text-[#667680]">
        {location.address}
      </p>
    </div>
  );
}

interface TransportInfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TransportInfoCard({
  icon,
  title,
  description,
}: TransportInfoCardProps): React.ReactElement {
  return (
    <article className="rounded-[26px] border border-[#B9C6D0] bg-[#D6DADB]/70 p-6 transition duration-300 hover:-translate-y-1 hover:bg-[#CBD3D6]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A7BDD3] text-[#526F85]">
        {icon}
      </div>

      <h3 className="mt-5 font-[var(--font-fredoka)] text-xl font-semibold text-[#263640]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#667680]">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#526F85]">
        Explore
        <ChevronRight size={14} />
      </div>
    </article>
  );
}

function TransportResultsSkeleton(): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="h-8 w-52 animate-pulse rounded-lg bg-[#CBD3D6]" />

      <div className="h-4 w-72 animate-pulse rounded-lg bg-[#CBD3D6]" />

      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="rounded-[26px] border border-[#B9C6D0] bg-[#D6DADB]/70 p-6"
          >
            <div className="animate-pulse">
              <div className="h-5 w-44 rounded bg-[#CBD3D6]" />

              <div className="mt-4 h-4 w-64 rounded bg-[#CBD3D6]" />

              <div className="mt-6 h-12 w-full rounded-xl bg-[#CBD3D6]" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}