"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound(): React.ReactElement {
  return (
    <main className="relative min-h-[calc(100vh-140px)] overflow-hidden bg-[#CBD3D6] text-[#263640]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-64 w-64 rounded-full bg-[#A7BDD3]/45 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-[#D3C8B8]/60 blur-3xl" />

        <div className="absolute left-[8%] top-[22%] h-24 w-24 rounded-full border border-[#6689A5]/20" />

        <div className="absolute right-[10%] top-[16%] h-28 w-28 rounded-full border border-[#D3C8B8]/60" />

        <svg
          className="absolute inset-0 h-full w-full opacity-20"
          viewBox="0 0 1440 700"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-40 520 C220 350 330 620 560 440 S850 180 1100 360 S1320 500 1480 350"
            stroke="#6689A5"
            strokeWidth="2"
            strokeDasharray="8 12"
          />

          <path
            d="M-50 170 C180 260 260 100 460 210 S760 360 960 230 S1240 100 1490 190"
            stroke="#526F85"
            strokeWidth="1.5"
            strokeDasharray="6 14"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-140px)] max-w-7xl items-center px-6 py-8 sm:px-10 lg:px-14">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-12">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#6689A5]/20 bg-[#E8ECF3]/55 px-3 py-1.5 backdrop-blur-md"
            >
              <MapPin size={14} className="text-[#6689A5]" />

              <span className="font-[var(--font-nunito)] text-[11px] font-bold tracking-wide text-[#526F85]">
                Destination not found
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55 }}
              className="font-[var(--font-fredoka)] text-[clamp(6rem,13vw,11rem)] font-bold leading-[0.72] tracking-[-0.08em] text-[#6689A5]"
            >
              404
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-6 max-w-[600px] font-[var(--font-fredoka)] text-3xl font-semibold leading-[1.05] tracking-tight text-[#263640] sm:text-4xl lg:text-5xl"
            >
              Looks like this route
              <span className="text-[#6689A5]"> doesn&apos;t exist.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-[480px] font-[var(--font-nunito)] text-sm leading-6 text-[#667680]"
            >
              The place you&apos;re looking for isn&apos;t on our map yet.
              Let&apos;s take you back to a route that works.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link
                href="/"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#526F85] px-5 py-3 font-[var(--font-nunito)] text-sm font-bold text-[#E8ECF3] shadow-lg shadow-[#526F85]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#6689A5]"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                Back to home
              </Link>

              <Link
                href="/explore"
                className="group inline-flex items-center gap-2 rounded-full border border-[#526F85]/20 bg-[#E8ECF3]/55 px-5 py-3 font-[var(--font-nunito)] text-sm font-bold text-[#526F85] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#E8ECF3]/80"
              >
                Explore CityHop
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto hidden h-[330px] w-full max-w-[390px] lg:block"
          >
            <div className="absolute inset-3 rotate-2 rounded-[32px] border border-[#526F85]/15 bg-[#D6DADB]/75 p-4 shadow-[0_25px_60px_rgba(38,54,64,0.13)] backdrop-blur-xl">
              <div className="relative h-full overflow-hidden rounded-[24px] bg-[#A7BDD3]/35">
                {/* Grid */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "linear-gradient(#526F85 1px, transparent 1px), linear-gradient(90deg, #526F85 1px, transparent 1px)",
                    backgroundSize: "38px 38px",
                  }}
                />

                {/* Route */}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 300"
                  fill="none"
                >
                  <path
                    d="M35 245 C85 205 80 105 155 130 C225 153 205 235 275 190 C325 160 310 80 365 45"
                    stroke="#526F85"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8 10"
                  />
                </svg>

                {/* Start */}
                <div className="absolute bottom-[38px] left-[25px] flex h-10 w-10 items-center justify-center rounded-full bg-[#526F85] text-[#E8ECF3] shadow-lg">
                  <MapPin size={18} />
                </div>

                {/* Destination */}
                <div className="absolute right-[26px] top-[28px] flex h-10 w-10 items-center justify-center rounded-full bg-[#D3C8B8] text-[#526F85] shadow-lg">
                  <Navigation size={17} />
                </div>

                {/* Center */}
                <div className="absolute left-1/2 top-1/2 w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#526F85]/10 bg-[#E8ECF3]/85 p-3.5 shadow-lg backdrop-blur-md">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#6689A5]" />

                    <span className="font-[var(--font-nunito)] text-[9px] font-bold uppercase tracking-wider text-[#667680]">
                      Current route
                    </span>
                  </div>

                  <p className="font-[var(--font-fredoka)] text-base font-semibold text-[#263640]">
                    Wrong turn
                  </p>

                  <p className="mt-1 font-[var(--font-nunito)] text-[11px] text-[#667680]">
                    Let&apos;s find another way.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-1 -left-1 rounded-2xl border border-[#526F85]/10 bg-[#D3C8B8]/90 px-3.5 py-2.5 shadow-lg backdrop-blur-md"
            >
              <p className="font-[var(--font-nunito)] text-[9px] font-bold uppercase tracking-wider text-[#667680]">
                Next stop
              </p>

              <p className="mt-0.5 font-[var(--font-fredoka)] text-sm font-semibold text-[#263640]">
                CityHop
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-1 top-3 rounded-full border border-[#526F85]/10 bg-[#E8ECF3]/80 px-3.5 py-1.5 shadow-lg backdrop-blur-md"
            >
              <span className="font-[var(--font-nunito)] text-[11px] font-bold text-[#526F85]">
                ✦ Explore
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
