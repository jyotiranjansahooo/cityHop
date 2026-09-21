"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound(): React.ReactElement {
  return (
    <main className="relative h-screen overflow-hidden bg-[#CBD3D6] text-[#263640]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#A7BDD3]/50 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[#D3C8B8]/70 blur-3xl" />

        <div className="absolute left-[8%] top-[18%] h-32 w-32 rounded-full border border-[#6689A5]/20" />
        <div className="absolute left-[11%] top-[22%] h-16 w-16 rounded-full border border-[#6689A5]/20" />

        <div className="absolute right-[8%] top-[15%] h-40 w-40 rounded-full border border-[#D3C8B8]/70" />

        {/* Route lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M80 680 C300 500 320 760 540 590 S900 300 1160 470 S1330 650 1450 520"
            stroke="#6689A5"
            strokeWidth="2"
            strokeDasharray="8 12"
          />
          <path
            d="M-50 210 C180 300 250 140 430 230 S720 420 930 270 S1200 100 1490 220"
            stroke="#526F85"
            strokeWidth="1.5"
            strokeDasharray="6 14"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col px-6 py-5 sm:px-10 sm:py-7 lg:px-14 lg:py-8">
        {/* Navbar */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/logo.png"
              alt="CityHop"
              className="h-auto w-[42px] object-contain sm:w-[48px]"
            />
          </Link>

          <div className="hidden items-center gap-3 rounded-full border border-[#526F85]/15 bg-[#E8ECF3]/45 px-4 py-2 backdrop-blur-md sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#6689A5]" />
            <span className="font-[var(--font-nunito)] text-xs font-semibold text-[#526F85]">
              CityHop Navigation
            </span>
          </div>
        </header>

        {/* Main */}
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6689A5]/20 bg-[#E8ECF3]/55 px-4 py-2 backdrop-blur-md"
              >
                <MapPin size={15} className="text-[#6689A5]" />
                <span className="font-[var(--font-nunito)] text-xs font-bold tracking-wide text-[#526F85]">
                  Destination not found
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.65 }}
                className="font-[var(--font-fredoka)] text-[clamp(8rem,18vw,15rem)] font-bold leading-[0.72] tracking-[-0.08em] text-[#6689A5]"
              >
                404
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="mt-9 max-w-[650px] font-[var(--font-fredoka)] text-4xl font-semibold leading-[1.02] tracking-tight text-[#263640] sm:text-5xl lg:text-6xl"
              >
                Looks like this URL
                <span className="text-[#6689A5]"> doesn&apos;t exist.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="mt-5 max-w-[520px] font-[var(--font-nunito)] text-sm leading-6 text-[#667680] sm:text-base"
              >
                The place you&apos;re looking for isn&apos;t on our map yet.
                Let&apos;s take you back to a route that works.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35 }}
                className="mt-7 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#526F85] px-6 py-3.5 font-[var(--font-nunito)] text-sm font-bold text-[#E8ECF3] shadow-lg shadow-[#526F85]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#6689A5]"
                >
                  <ArrowLeft
                    size={17}
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  />
                  Back to home
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-[#526F85]/20 bg-[#E8ECF3]/50 px-6 py-3.5 font-[var(--font-nunito)] text-sm font-bold text-[#526F85] backdrop-blur-md transition-all duration-300 hover:bg-[#E8ECF3]/80"
                >
                  Start exploring
                  <ArrowUpRight size={17} />
                </Link>
              </motion.div>
            </div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative mx-auto hidden h-[390px] w-full max-w-[440px] lg:block"
            >
              {/* Main map card */}
              <div className="absolute inset-4 rotate-2 rounded-[38px] border border-[#526F85]/15 bg-[#D6DADB]/75 p-5 shadow-[0_30px_80px_rgba(38,54,64,0.14)] backdrop-blur-xl">
                <div className="relative h-full overflow-hidden rounded-[28px] bg-[#A7BDD3]/35">
                  {/* Map grid */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(#526F85 1px, transparent 1px), linear-gradient(90deg, #526F85 1px, transparent 1px)",
                      backgroundSize: "42px 42px",
                    }}
                  />

                  {/* Route */}
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 400 330"
                    fill="none"
                  >
                    <path
                      d="M40 260 C90 220 85 120 165 145 C235 168 210 250 285 205 C330 178 315 85 360 55"
                      stroke="#526F85"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="9 10"
                    />
                  </svg>

                  {/* Location pins */}
                  <div className="absolute left-[28px] bottom-[45px] flex h-11 w-11 items-center justify-center rounded-full bg-[#526F85] text-[#E8ECF3] shadow-lg">
                    <MapPin size={20} />
                  </div>

                  <div className="absolute right-[30px] top-[35px] flex h-11 w-11 items-center justify-center rounded-full bg-[#D3C8B8] text-[#526F85] shadow-lg">
                    <Navigation size={19} />
                  </div>

                  {/* Center card */}
                  <div className="absolute left-1/2 top-1/2 w-[185px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#526F85]/10 bg-[#E8ECF3]/85 p-4 shadow-xl backdrop-blur-md">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#6689A5]" />
                      <span className="font-[var(--font-nunito)] text-[10px] font-bold uppercase tracking-wider text-[#667680]">
                        Current route
                      </span>
                    </div>

                    <p className="font-[var(--font-fredoka)] text-lg font-semibold text-[#263640]">
                      Wrong turn
                    </p>

                    <p className="mt-1 font-[var(--font-nunito)] text-xs text-[#667680]">
                      Let&apos;s find another way.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating destination card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-1 -left-2 rounded-2xl border border-[#526F85]/10 bg-[#D3C8B8]/90 px-4 py-3 shadow-xl backdrop-blur-md"
              >
                <p className="font-[var(--font-nunito)] text-[10px] font-bold uppercase tracking-wider text-[#667680]">
                  Next stop
                </p>
                <p className="mt-1 font-[var(--font-fredoka)] text-base font-semibold text-[#263640]">
                  CityHop Home
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-2 top-4 rounded-full border border-[#526F85]/10 bg-[#E8ECF3]/80 px-4 py-2 shadow-lg backdrop-blur-md"
              >
                <span className="font-[var(--font-nunito)] text-xs font-bold text-[#526F85]">
                  ✦ Explore
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between font-[var(--font-nunito)] text-[11px] text-[#667680]">
          <span>Explore. Move. Settle.</span>
          <span className="hidden sm:block">© CityHop</span>
        </footer>
      </div>
    </main>
  );
}
