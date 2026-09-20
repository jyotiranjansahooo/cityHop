import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";

export default function HeroSection(): React.ReactElement {
  return (
    <section className="relative z-10 mx-auto max-w-[1440px] px-5 pb-7 sm:px-8 lg:px-12">
      <div className="relative min-h-[620px] overflow-hidden rounded-[38px] border border-[#C3CDD4] bg-[#D8D7D1] shadow-[0_30px_80px_rgba(38,54,64,0.14)]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(167,189,211,0.8),transparent_30%),linear-gradient(115deg,#DCD8D0_0%,#D5D6D1_45%,#B9C8D3_100%)]" />

        <div className="absolute right-[-8%] top-[8%] h-[480px] w-[58%] rounded-[45%] bg-[#9FB6C8]/45 blur-[1px] lg:h-[560px]" />

        <div className="absolute bottom-0 right-0 h-[70%] w-[55%] overflow-hidden rounded-tl-[48%] bg-gradient-to-br from-[#9EB5C6] via-[#829DB2] to-[#5E788D] opacity-80">
          <div className="absolute left-[18%] top-[22%] h-48 w-40 rounded-t-[80px] bg-[#B6C2C7]/50" />

          <div className="absolute left-[42%] top-[14%] h-64 w-28 rounded-t-full bg-[#C2CCC9]/55" />

          <div className="absolute bottom-[15%] left-[8%] h-20 w-[80%] rotate-[-7deg] rounded-full bg-[#596F7D]/50" />

          <div className="absolute bottom-[26%] right-[10%] h-28 w-48 rotate-[5deg] rounded-[50%] border-[14px] border-[#C9D0D0]/50" />
        </div>

        <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-7 sm:p-10 lg:p-14">

          <div className="max-w-[610px] ">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#9EADB7] bg-[#D9D8D2]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#526573] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6B8FB1]" />
              New city. New beginnings.
            </div>

            <h1 className="max-w-[650px] font-[var(--font-fredoka)] text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-[#263640] sm:text-6xl lg:text-[76px]">
              A smoother move to a{" "}
              <span className="text-[#6689A5]">
                brighter tomorrow.
              </span>
            </h1>

            <p className="mt-6 max-w-[560px] text-base leading-7 text-[#526573] sm:text-lg">
              Find homes, plan your move, compare transport, and settle into
              your next city with everything in one place.
            </p>

            <div className="mt-9 mb-4 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#526F85] px-6 py-3.5 text-sm font-bold text-[#E8ECF3] shadow-xl shadow-[#526F85]/20 transition hover:-translate-y-0.5 hover:bg-[#3F596C]"
              >
                Start exploring
                <ArrowRight size={17} />
              </Link>

              <Link
                href="#homes"
                className="inline-flex items-center gap-2 rounded-full border border-[#9FAEB8] bg-[#DADBD7]/75 px-6 py-3.5 text-sm font-bold text-[#3E515D] backdrop-blur transition hover:bg-[#C9D0D3]"
              >
                Explore homes
              </Link>
            </div>
          </div>

          {/* Search panel */}
          <div className="mt-12 lg:mt-0">
            <div className="max-w-[850px] rounded-[26px] border border-[#B8C2C8]/80 bg-[#DDE0DD]/85 p-3 shadow-[0_20px_60px_rgba(38,54,64,0.12)] backdrop-blur-xl">

              <div className="flex flex-wrap gap-2 border-b border-[#BBC4C8] px-2 pb-3">
                <button className="rounded-full bg-[#526F85] px-5 py-2 text-xs font-bold text-[#E8ECF3]">
                  Homes
                </button>

                <button className="rounded-full px-5 py-2 text-xs font-bold text-[#5B6B75] transition hover:bg-[#C9D0D3]">
                  Moving
                </button>

                <button className="rounded-full px-5 py-2 text-xs font-bold text-[#5B6B75] transition hover:bg-[#C9D0D3]">
                  Transport
                </button>

                <button className="rounded-full px-5 py-2 text-xs font-bold text-[#5B6B75] transition hover:bg-[#C9D0D3]">
                  Hostels
                </button>
              </div>

              <div className="grid gap-3 p-2 sm:grid-cols-[1fr_1fr_auto]">

                <div className="rounded-2xl border border-[#BBC5CA] bg-[#D5D8D7] px-4 py-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#70808A]">
                    <MapPin size={13} />
                    From
                  </div>

                  <p className="text-sm font-bold text-[#344650]">
                    Bhubaneswar, Odisha
                  </p>
                </div>

                <div className="rounded-2xl border border-[#BBC5CA] bg-[#D5D8D7] px-4 py-3">
                  <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#70808A]">
                    <MapPin size={13} />
                    To
                  </div>

                  <p className="text-sm font-bold text-[#344650]">
                    Cuttack, Odisha
                  </p>
                </div>

                <button className="flex min-h-[66px] items-center justify-center gap-2 rounded-2xl bg-[#6689A5] px-6 text-sm font-bold text-[#E8ECF3] transition hover:bg-[#526F85]">
                  <Search size={18} />
                  Search
                </button>

              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-[7%] top-[15%] hidden w-52 rotate-[-4deg] rounded-2xl border border-[#C5CED1]/70 bg-[#DADDD9]/80 p-4 shadow-xl backdrop-blur-md lg:block">
          <p className="font-serif text-xl italic leading-tight text-[#3D4D56]">
            Explore.
            <br />
            Move.
            <br />
            Settle.
          </p>

          <div className="mt-3 h-px w-16 bg-[#6689A5]" />
        </div>

      </div>
    </section>
  );
}