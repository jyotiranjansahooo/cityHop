"use client";

import {
  ArrowRight,
  Bus,
  CalendarDays,
  ChevronDown,
  Search,
  Train,
  WalletCards,
} from "lucide-react";
import { FormEvent, useState } from "react";
import LocationAutocomplete, {
  type SelectedLocation,
} from "../components/moving/LocationAutocomplete";

type TravelMedium = "bus" | "train" | "any";

interface SearchForm {
  travelDate: string;
  medium: TravelMedium;
  maxCost: string;
}

export default function MovingPage(): React.ReactElement {
  const [fromLocation, setFromLocation] = useState<SelectedLocation | null>(
    null,
  );

  const [destinationLocation, setDestinationLocation] =
    useState<SelectedLocation | null>(null);

  const [form, setForm] = useState<SearchForm>({
    travelDate: "",
    medium: "any",
    maxCost: "",
  });

  const [searchError, setSearchError] = useState("");

  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const today = new Date();

  const todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setSearchError("");
    setSearchSubmitted(false);

    if (!fromLocation) {
      setSearchError(
        "Please search for your starting location and select a suggestion.",
      );
      return;
    }

    if (!destinationLocation) {
      setSearchError(
        "Please search for your destination and select a suggestion.",
      );
      return;
    }

    if (!form.travelDate) {
      setSearchError("Please select your travel date.");
      return;
    }

    if (form.maxCost) {
      const cost = Number(form.maxCost);

      if (!Number.isFinite(cost) || cost < 0) {
        setSearchError("Please enter a valid maximum travel cost.");
        return;
      }
    }

    setSearchSubmitted(true);

    console.log({
      from: fromLocation,
      destination: destinationLocation,
      travelDate: form.travelDate,
      medium: form.medium,
      maxCost: form.maxCost ? Number(form.maxCost) : undefined,
    });
  };

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-5 pb-20 pt-[120px] text-[#263640] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <section className="mb-10 max-w-[760px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#D3C8B8] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#526F85]">
            <Search size={14} />
            Plan your journey
          </div>

          <h1 className="font-[var(--font-fredoka)] text-5xl font-semibold leading-[1.05] tracking-tight text-[#263640] sm:text-6xl">
            Where are you
            <span className="text-[#6689A5]"> moving?</span>
          </h1>

          <p className="mt-5 max-w-[700px] text-base leading-7 text-[#667680] sm:text-lg">
            Search real locations, choose your destination and find the
            transport options that fit your journey.
          </p>
        </section>

        {/* Search card */}
        <section className="rounded-[32px] border border-[#B9C6D0] bg-[#D6DADB] p-5 shadow-[0_24px_70px_rgba(38,54,64,0.08)] sm:p-7 lg:p-9">
          <form onSubmit={handleSubmit}>
            {/* Locations */}
            <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
              <LocationAutocomplete
                label="Starting location"
                placeholder="Search your current location"
                selectedLocation={fromLocation}
                onSelect={setFromLocation}
                onClear={() => setFromLocation(null)}
                allowCurrentLocation
              />

              <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-[#CBD3D6] text-[#6689A5] lg:flex">
                <ArrowRight size={21} />
              </div>

              <LocationAutocomplete
                label="Destination"
                placeholder="Search where you want to go"
                selectedLocation={destinationLocation}
                onSelect={setDestinationLocation}
                onClear={() => setDestinationLocation(null)}
              />
            </div>

            {/* Selected route */}
            {fromLocation && destinationLocation && (
              <div className="mt-6 rounded-2xl border border-[#B9C6D0] bg-[#CBD3D6] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667680]">
                      Starting from
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-[#263640]">
                      {fromLocation.name}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="hidden shrink-0 text-[#6689A5] sm:block"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667680]">
                      Going to
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-[#263640]">
                      {destinationLocation.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {/* Date */}
              <div>
                <label
                  htmlFor="travelDate"
                  className="mb-2 block text-sm font-bold text-[#33444E]"
                >
                  Travel date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                  />

                  <input
                    id="travelDate"
                    type="date"
                    min={todayString}
                    value={form.travelDate}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        travelDate: event.target.value,
                      }));

                      setSearchError("");
                      setSearchSubmitted(false);
                    }}
                    className="h-14 w-full rounded-2xl border border-[#B9C6D0] bg-[#E8ECF3] px-4 pl-11 text-sm font-semibold text-[#263640] outline-none transition focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <label
                  htmlFor="medium"
                  className="mb-2 block text-sm font-bold text-[#33444E]"
                >
                  Travel medium
                </label>

                <div className="relative">
                  {form.medium === "train" ? (
                    <Train
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                    />
                  ) : (
                    <Bus
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                    />
                  )}

                  <select
                    id="medium"
                    value={form.medium}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        medium: event.target.value as TravelMedium,
                      }));

                      setSearchError("");
                      setSearchSubmitted(false);
                    }}
                    className="h-14 w-full appearance-none rounded-2xl border border-[#B9C6D0] bg-[#E8ECF3] px-4 pl-11 pr-10 text-sm font-semibold text-[#263640] outline-none transition focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
                  >
                    <option value="any">Bus or Train</option>

                    <option value="bus">Bus</option>

                    <option value="train">Train</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#667680]"
                  />
                </div>
              </div>

              {/* Cost */}
              <div>
                <label
                  htmlFor="maxCost"
                  className="mb-2 block text-sm font-bold text-[#33444E]"
                >
                  Maximum travel cost
                </label>

                <div className="relative">
                  <WalletCards
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6689A5]"
                  />

                  <input
                    id="maxCost"
                    type="number"
                    min="0"
                    step="50"
                    value={form.maxCost}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        maxCost: event.target.value,
                      }));

                      setSearchError("");
                      setSearchSubmitted(false);
                    }}
                    placeholder="₹ 2,000"
                    className="h-14 w-full rounded-2xl border border-[#B9C6D0] bg-[#E8ECF3] px-4 pl-11 text-sm font-semibold text-[#263640] outline-none transition focus:border-[#6689A5] focus:ring-2 focus:ring-[#A7BDD3]"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#526F85] px-6 text-sm font-bold text-[#E8ECF3] shadow-lg shadow-[#526F85]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#3F596C] hover:shadow-xl"
                >
                  <Search size={18} />
                  Search journey
                </button>
              </div>
            </div>

            {/* Error */}
            {searchError && (
              <div className="mt-5 rounded-2xl border border-[#D3C8B8] bg-[#D3C8B8] px-4 py-3 text-sm font-semibold leading-6 text-[#526F85]">
                {searchError}
              </div>
            )}
          </form>
        </section>

        {/* Search result state */}
        {searchSubmitted && (
          <section className="mt-8 rounded-[28px] border border-[#B9C6D0] bg-[#D6DADB] p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6689A5]">
              Journey search
            </p>

            <h2 className="mt-2 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
              Search request ready
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#CBD3D6] p-4">
                <p className="text-xs text-[#667680]">From</p>

                <p className="mt-1 text-sm font-bold text-[#263640]">
                  {fromLocation?.name}
                </p>

                <p className="mt-1 text-xs text-[#667680]">
                  {fromLocation?.latitude.toFixed(5)},{" "}
                  {fromLocation?.longitude.toFixed(5)}
                </p>
              </div>

              <div className="rounded-2xl bg-[#CBD3D6] p-4">
                <p className="text-xs text-[#667680]">Destination</p>

                <p className="mt-1 text-sm font-bold text-[#263640]">
                  {destinationLocation?.name}
                </p>

                <p className="mt-1 text-xs text-[#667680]">
                  {destinationLocation?.latitude.toFixed(5)},{" "}
                  {destinationLocation?.longitude.toFixed(5)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-[#9EADB6] bg-[#E8ECF3] p-5">
              <p className="text-sm font-bold text-[#33444E]">
                Transport search API comes next.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#667680]">
                The selected locations are now real geographic coordinates. We
                can use these coordinates with the transport service to search
                actual bus and train journeys.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
