"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  House,
  MapPinned,
  Truck,
} from "lucide-react";

interface MovingStep {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const movingSteps: MovingStep[] = [
  {
    number: "01",
    title: "Choose your destination",
    description:
      "Select the city and area where you are planning to move.",
    icon: MapPinned,
  },
  {
    number: "02",
    title: "Find your stay",
    description:
      "Explore available hostels and compare the options around your destination.",
    icon: House,
  },
  {
    number: "03",
    title: "Plan the move",
    description:
      "Check transportation options and organize your journey to the new place.",
    icon: Truck,
  },
  {
    number: "04",
    title: "Settle in",
    description:
      "Move into your new place and start your next chapter with less hassle.",
    icon: Boxes,
  },
];

export default function MovingSection(): React.ReactElement {
  return (
    <section className="overflow-hidden bg-[#E8ECF3] px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-[#D3C8B8] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#526F85]">
              Move with clarity
            </span>

            <h2 className="font-[var(--font-fredoka)] text-4xl font-semibold leading-tight text-[#263640] sm:text-5xl">
              Moving somewhere
              <br />
              new?
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#667680]">
              From choosing your destination to finding a place to stay,
              CityHop helps you organize the important parts of your move.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#526F85] px-5 py-3 text-sm font-semibold text-[#E8ECF3]">
              <span>Explore your next move</span>
              <ArrowUpRight size={17} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {movingSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group relative min-h-[230px] overflow-hidden rounded-[30px] border border-[#B9C4CA] bg-[#D6DADB] p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                      <Icon size={21} strokeWidth={1.8} />
                    </div>

                    <span className="font-[var(--font-fredoka)] text-sm font-semibold text-[#667680]">
                      {step.number}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-[var(--font-fredoka)] text-xl font-semibold text-[#263640]">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#667680]">
                      {step.description}
                    </p>
                  </div>

                  <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-[#A7BDD3]/40 transition-transform duration-500 group-hover:scale-150" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}