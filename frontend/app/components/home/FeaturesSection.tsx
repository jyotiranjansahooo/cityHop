"use client";

import { motion } from "framer-motion";
import {
  MapPinned,
  House,
  BusFront,
  ArrowUpRight,
} from "lucide-react";

interface FeatureItem {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const features: FeatureItem[] = [
  {
    number: "01",
    title: "Discover places",
    description:
      "Explore cities, areas, hostels and places that match where you want to move.",
    icon: MapPinned,
  },
  {
    number: "02",
    title: "Find your stay",
    description:
      "Browse available hostels and compare important details before choosing where to stay.",
    icon: House,
  },
  {
    number: "03",
    title: "Plan your journey",
    description:
      "Understand available transport options and plan how you will reach your new destination.",
    icon: BusFront,
  },
];

export default function FeaturesSection(): React.ReactElement {
  return (
    <section className="bg-[#E8ECF3] px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex rounded-full bg-[#CBD3D6] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#526F85]">
              Why CityHop
            </span>

            <h2 className="font-[var(--font-fredoka)] text-4xl font-semibold leading-tight text-[#263640] sm:text-5xl">
              Everything you need
              <br />
              before you move.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#667680] sm:text-base">
            CityHop brings your relocation journey together so you can explore
            your destination, find a place to stay and plan your move in one
            place.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="group relative min-h-[300px] overflow-hidden rounded-[32px] border border-[#B9C4CA] bg-[#D6DADB] p-7 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <span className="font-[var(--font-fredoka)] text-sm font-semibold text-[#667680]">
                    {feature.number}
                  </span>
                </div>

                <div className="absolute right-7 top-7 flex h-10 w-10 translate-x-16 items-center justify-center rounded-full bg-[#526F85] text-[#E8ECF3] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <ArrowUpRight size={19} />
                </div>

                <div className="absolute bottom-7 left-7 right-7">
                  <h3 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#667680]">
                    {feature.description}
                  </p>
                </div>

                <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-[#A7BDD3]/40 transition-transform duration-500 group-hover:scale-150" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}