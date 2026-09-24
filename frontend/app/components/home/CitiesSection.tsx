"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import Skeleton from "../ui/Skeleton";
import { getCities, type City } from "../lib/api/city";

export default function CitiesSection(): React.ReactElement {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCities = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getCities();

        setCities(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unable to load cities";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCities();
  }, []);

  return (
    <section className="bg-[#D6DADB] px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex rounded-full bg-[#A7BDD3] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#526F85]">
              Explore destinations
            </span>

            <h2 className="font-[var(--font-fredoka)] text-4xl font-semibold leading-tight text-[#263640] sm:text-5xl">
              Find your next
              <br />
              place to call home.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#667680] sm:text-base">
            Explore cities currently available on CityHop and discover the
            areas and stays available in each destination.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[30px] border border-[#B9C4CA] bg-[#E8ECF3]"
              >
                <Skeleton className="h-52 w-full rounded-none" />

                <div className="space-y-3 p-6">
                  <Skeleton className="h-7 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[30px] border border-[#B9C4CA] bg-[#E8ECF3] p-8 text-center">
            <MapPin
              className="mx-auto mb-4 text-[#667680]"
              size={30}
              strokeWidth={1.7}
            />

            <h3 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
              Cities are temporarily unavailable
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667680]">
              We could not load the available destinations right now. Please
              try again shortly.
            </p>
          </div>
        ) : cities.length === 0 ? (
          <div className="rounded-[30px] border border-[#B9C4CA] bg-[#E8ECF3] p-8 text-center">
            <MapPin
              className="mx-auto mb-4 text-[#667680]"
              size={30}
              strokeWidth={1.7}
            />

            <h3 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
              No destinations available yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667680]">
              CityHop will show destinations here as they become available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city, index) => (
              <motion.div
                key={city._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
              >
                <Link
                  href={"/explore?city=" + city._id}
                  className="group block overflow-hidden rounded-[30px] border border-[#B9C4CA] bg-[#E8ECF3] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#CBD3D6]">
                    <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-[#A7BDD3]/60" />
                    <div className="absolute bottom-[-35px] right-[-20px] h-36 w-36 rounded-full bg-[#D3C8B8]/70" />

                    <MapPin
                      size={54}
                      strokeWidth={1.4}
                      className="relative z-10 text-[#526F85]"
                    />

                    <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#526F85] text-[#E8ECF3] opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                          {city.name}
                        </h3>

                        {city.state && (
                          <p className="mt-1 text-sm text-[#667680]">
                            {city.state}
                          </p>
                        )}
                      </div>

                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#667680]">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}