"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BusFront,
  Home,
  MapPin,
  Navigation,
  Search,
} from "lucide-react";

export default function Loading(): React.ReactElement {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#CBD3D6] text-[#263640]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#A7BDD3]/55 blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -25, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-52 -right-40 h-[600px] w-[600px] rounded-full bg-[#D3C8B8]/80 blur-3xl"
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -left-24 top-[20%] h-[300px] w-[300px] rounded-full border border-[#526F85]/10"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -right-28 top-[8%] h-[360px] w-[360px] rounded-full border border-[#6689A5]/10"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="absolute bottom-[5%] left-[25%] h-40 w-40 rounded-full border border-[#526F85]/15"
        />

        {/* Floating particles */}
        <motion.span
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute left-[8%] top-[35%] h-3 w-3 rounded-full bg-[#6689A5]"
        />

        <motion.span
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
          }}
          className="absolute right-[10%] top-[30%] h-4 w-4 rounded-full bg-[#526F85]"
        />

        <motion.span
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute bottom-[22%] right-[20%] h-2.5 w-2.5 rounded-full bg-[#D3C8B8]"
        />
      </div>

      {/* Page */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col px-6 py-5 sm:px-10 sm:py-6 lg:px-14 lg:py-7">
        {/* Header */}
        <header className="flex items-center justify-between">
          <motion.img
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            src="/logo.png"
            alt="CityHop"
            className="w-[80px] object-contain sm:w-[90px]"
          />

          <motion.div
            initial={{
              opacity: 0,
              x: 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="hidden items-center gap-2 rounded-full border border-[#526F85]/15 bg-[#E8ECF3]/45 px-5 py-2.5 backdrop-blur-xl sm:flex"
          >
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#6689A5]" />

            <span className="font-[var(--font-nunito)] text-xs font-bold text-[#526F85]">
              Preparing your journey
            </span>
          </motion.div>
        </header>

        {/* Main */}
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <div className="relative flex w-full max-w-[1100px] flex-col items-center">
            {/* Heading */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="mb-5 text-center"
            >
              <p className="font-[var(--font-nunito)] text-xs font-bold uppercase tracking-[0.25em] text-[#667680]">
                CityHop
              </p>

              <h1 className="mt-2 font-[var(--font-fredoka)] text-4xl font-semibold tracking-tight text-[#263640] sm:text-5xl lg:text-6xl">
                Finding your way
              </h1>
            </motion.div>

            {/* Journey board */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="relative h-[330px] w-full overflow-hidden rounded-[42px] border border-[#526F85]/15 bg-[#D6DADB]/65 shadow-[0_30px_90px_rgba(38,54,64,0.13)] backdrop-blur-xl sm:h-[380px] lg:h-[410px]"
            >
              {/* Map grid */}
              <div
                className="absolute inset-0 opacity-[0.13]"
                style={{
                  backgroundImage:
                    "linear-gradient(#526F85 1px, transparent 1px), linear-gradient(90deg, #526F85 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              {/* Decorative map areas */}
              <motion.div
                animate={{
                  x: [0, 20, 0],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-[8%] top-[10%] h-32 w-44 rounded-[50%] bg-[#A7BDD3]/25 blur-xl"
              />

              <motion.div
                animate={{
                  x: [0, -20, 0],
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[5%] right-[5%] h-40 w-52 rounded-[50%] bg-[#D3C8B8]/35 blur-xl"
              />

              {/* Curved route */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1100 410"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* Background route */}
                <path
                  d="M100 315 C210 120 300 365 420 220 C540 75 610 330 730 205 C820 110 890 250 1000 90"
                  stroke="#526F85"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="10 14"
                  opacity="0.16"
                />

                {/* Animated route */}
                <motion.path
                  d="M100 315 C210 120 300 365 420 220 C540 75 610 330 730 205 C820 110 890 250 1000 90"
                  stroke="#6689A5"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="12 14"
                  initial={{
                    pathLength: 0,
                  }}
                  animate={{
                    pathLength: 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </svg>

              {/* Start Location */}
              <div className="absolute bottom-[32px] left-[6%] z-10">
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#526F85] text-[#E8ECF3] shadow-xl"
                >
                  <Home size={27} />
                </motion.div>

                <div className="mt-2 rounded-full bg-[#E8ECF3]/75 px-3 py-1 text-center font-[var(--font-nunito)] text-[10px] font-bold text-[#526F85] backdrop-blur">
                  Location A
                </div>
              </div>

              {/* Destination */}
              <div className="absolute right-[5%] top-[28px] z-10">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.75,
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#6689A5] text-[#E8ECF3] shadow-xl"
                >
                  <MapPin size={28} />
                </motion.div>

                <div className="mt-2 rounded-full bg-[#E8ECF3]/75 px-3 py-1 text-center font-[var(--font-nunito)] text-[10px] font-bold text-[#526F85] backdrop-blur">
                  Location B
                </div>
              </div>

              {/* Bus travelling along exact SVG path */}
              <svg
                className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
                viewBox="0 0 1100 410"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.g
                  animate={{
                    offsetDistance: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    offsetPath:
                      "path('M100 315 C210 120 300 365 420 220 C540 75 610 330 730 205 C820 110 890 250 1000 90')",
                    offsetRotate: "auto",
                  }}
                >
                  <foreignObject
                    x="-28"
                    y="-28"
                    width="56"
                    height="56"
                    overflow="visible"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D3C8B8] text-[#526F85] shadow-[0_12px_30px_rgba(38,54,64,0.22)]">
                      <BusFront size={26} />
                    </div>
                  </foreignObject>
                </motion.g>
              </svg>

              {/* Central route information */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 z-30 w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-[#526F85]/10 bg-[#E8ECF3]/85 p-5 shadow-2xl backdrop-blur-xl sm:w-[290px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#A7BDD3]/60 text-[#526F85]">
                    <Navigation size={21} />
                  </div>

                  <div className="text-left">
                    <p className="font-[var(--font-nunito)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#667680]">
                      Route planner
                    </p>

                    <p className="mt-1 font-[var(--font-fredoka)] text-lg font-semibold text-[#263640]">
                      Finding your route
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#526F85]/10">
                  <motion.div
                    animate={{
                      width: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-full rounded-full bg-[#6689A5]"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between font-[var(--font-nunito)] text-[9px] text-[#667680]">
                  <span>Starting</span>
                  <span>Arriving</span>
                </div>
              </motion.div>

              {/* Search card */}
              <motion.div
                animate={{
                  y: [0, 6, 0],
                  rotate: [-1, 0, -1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-[24px] left-[28%] z-30 hidden items-center gap-3 rounded-2xl border border-[#526F85]/10 bg-[#E8ECF3]/75 px-4 py-3 shadow-xl backdrop-blur-xl md:flex"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D3C8B8]/70 text-[#526F85]">
                  <Search size={17} />
                </div>

                <div>
                  <p className="font-[var(--font-nunito)] text-[9px] font-bold uppercase tracking-wider text-[#667680]">
                    Searching
                  </p>

                  <p className="font-[var(--font-fredoka)] text-sm font-semibold text-[#263640]">
                    Places & transport
                  </p>
                </div>

                <ArrowRight size={16} className="text-[#6689A5]" />
              </motion.div>
            </motion.div>

            {/* Bottom text */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.35,
              }}
              className="mt-6 text-center"
            >
              <p className="font-[var(--font-nunito)] text-sm text-[#667680]">
                Preparing places, routes and everything you need to move.
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                {[0, 1, 2].map((index) => (
                  <motion.span
                    key={index}
                    animate={{
                      y: [0, -5, 0],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: index * 0.15,
                    }}
                    className="h-2.5 w-2.5 rounded-full bg-[#6689A5]"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between font-[var(--font-nunito)] text-[10px] font-bold uppercase tracking-[0.16em] text-[#667680]">
          <span>Explore · Move · Settle</span>
          <span className="hidden sm:block">CityHop</span>
        </footer>
      </div>
    </main>
  );
}
