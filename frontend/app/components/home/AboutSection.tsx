"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Compass, MapPinned, Sparkles } from "lucide-react";

const aboutPoints = [
  {
    icon: Compass,
    title: "Explore",
    description:
      "Discover cities and areas that fit where you want to start your next chapter.",
  },
  {
    icon: MapPinned,
    title: "Compare",
    description:
      "Understand your destination before deciding where you want to stay.",
  },
  {
    icon: Sparkles,
    title: "Settle",
    description:
      "Bring your stay and journey planning together in one simple experience.",
  },
];

export default function AboutSection(): React.ReactElement {
  return (
    <section
      id="about"
      className="scroll-mt-4 overflow-hidden bg-[#E8ECF3] px-6 py-20 sm:px-10 lg:px-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-flex rounded-full bg-[#D3C8B8] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#526F85]">
              About CityHop
            </span>

            <h2 className="font-[var(--font-fredoka)] text-4xl font-semibold leading-tight text-[#263640] sm:text-5xl">
              A simpler way to
              <br />
              start somewhere new.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#667680]">
              Moving to another city involves more than finding an address. You
              need to understand the area, find somewhere to stay and figure out
              how to get there. CityHop brings these pieces together into one
              journey.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#526F85] px-5 py-3 text-sm font-semibold text-[#E8ECF3]">
              <span>Discover CityHop</span>
              <ArrowUpRight size={17} />
            </div>
          </motion.div>

          <div className="grid gap-4">
            {aboutPoints.map((point, index) => {
              const Icon = point.icon;

              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group flex items-start gap-5 rounded-[28px] border border-[#B9C4CA] bg-[#D6DADB] p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85] transition-transform duration-300 group-hover:scale-105">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="font-[var(--font-fredoka)] text-xl font-semibold text-[#263640]">
                      {point.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#667680]">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
