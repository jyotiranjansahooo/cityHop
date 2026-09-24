"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BusFront,
  CarFront,
  TrainFront,
} from "lucide-react";

interface TransportOption {
  title: string;
  description: string;
  icon: React.ElementType;
}

const transportOptions: TransportOption[] = [
  {
    title: "Bus",
    description:
      "Explore bus options for reaching your destination and moving between places.",
    icon: BusFront,
  },
  {
    title: "Train",
    description:
      "Check train-based travel options when rail connectivity is available.",
    icon: TrainFront,
  },
  {
    title: "Car",
    description:
      "Plan a flexible road journey when travelling by car is more convenient.",
    icon: CarFront,
  },
];

export default function TransportSection(): React.ReactElement {
  return (
    <section className="bg-[#D6DADB] px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-[#A7BDD3] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#526F85]">
              Travel options
            </span>

            <h2 className="font-[var(--font-fredoka)] text-4xl font-semibold leading-tight text-[#263640] sm:text-5xl">
              Choose how
              <br />
              you want to move.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#667680]">
              CityHop is designed to help you understand the transport
              options available for your journey so you can plan your move
              around your destination.
            </p>

            <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#526F85]">
              <span>Plan your journey</span>
              <ArrowUpRight size={17} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {transportOptions.map((option, index) => {
              const Icon = option.icon;

              return (
                <motion.article
                  key={option.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group relative min-h-[270px] overflow-hidden rounded-[30px] border border-[#B9C4CA] bg-[#E8ECF3] p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CBD3D6] text-[#526F85] transition-transform duration-300 group-hover:scale-105">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                      {option.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#667680]">
                      {option.description}
                    </p>
                  </div>

                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D3C8B8]/60 transition-transform duration-500 group-hover:scale-150" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}