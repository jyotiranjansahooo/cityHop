import Link from "next/link";
import {
  ArrowRight,
  BusFront,
  ChevronRight,
  CircleDollarSign,
  House,
  MapPin,
  Search,
  ShieldCheck,
  TrainFront,
  Users,
} from "lucide-react";

const cities = [
  {
    name: "Bhubaneswar",
    subtitle: "1.2K+ homes",
    className: "city-bhubaneswar",
  },
  {
    name: "Cuttack",
    subtitle: "800+ homes",
    className: "city-cuttack",
  },
  {
    name: "Puri",
    subtitle: "650+ homes",
    className: "city-puri",
  },
];

const features = [
  {
    title: "Find a home",
    description: "Browse homes, flats and rooms in your destination city.",
    icon: House,
  },
  {
    title: "Plan your move",
    description: "Understand moving costs before you start your journey.",
    icon: CircleDollarSign,
  },
  {
    title: "Compare transport",
    description: "Compare bus, train and car options for your route.",
    icon: BusFront,
  },
  {
    title: "Explore new places",
    description: "Discover areas, cities and places around your destination.",
    icon: MapPin,
  },
];

export default function HomePage(): React.ReactElement {
  return (
    <main className="min-h-screen overflow-hidden bg-[#E8ECF3] text-[#263640]">
      <div className="relative">
        <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-[#A7BDD3]/30 blur-3xl" />
        <div className="pointer-events-none absolute right-[-10rem] top-20 h-[30rem] w-[30rem] rounded-full bg-[#D3C8B8]/35 blur-3xl" />

        <header className="relative z-20 mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-12">
          <nav className="flex items-center justify-between rounded-[28px] border border-[#B9C6D0]/70 bg-[#D9DEE1]/70 px-5 py-4 shadow-[0_12px_40px_rgba(38,54,64,0.08)] backdrop-blur-xl sm:px-7">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#526F85] text-[#E8ECF3] shadow-sm">
                <House size={21} strokeWidth={2.2} />
              </div>

              <div>
                <span className="block text-xl font-bold tracking-[-0.04em]">
                  CityHop
                </span>
                <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-[#526573] sm:block">
                  Move smarter
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              <Link
                href="#homes"
                className="text-sm font-medium text-[#526573] transition hover:text-[#263640]"
              >
                Homes
              </Link>

              <Link
                href="#moving"
                className="text-sm font-medium text-[#526573] transition hover:text-[#263640]"
              >
                Moving
              </Link>

              <Link
                href="#transport"
                className="text-sm font-medium text-[#526573] transition hover:text-[#263640]"
              >
                Transport
              </Link>

              <Link
                href="#cities"
                className="text-sm font-medium text-[#526573] transition hover:text-[#263640]"
              >
                Cities
              </Link>

              <Link
                href="#about"
                className="text-sm font-medium text-[#526573] transition hover:text-[#263640]"
              >
                About
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-full border border-[#AAB8C2] bg-[#DDE1E2]/80 px-4 py-2.5 text-sm font-semibold text-[#33444E] transition hover:bg-[#C9D1D5]"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="hidden rounded-full bg-[#526F85] px-5 py-2.5 text-sm font-semibold text-[#E8ECF3] shadow-lg shadow-[#526F85]/20 transition hover:bg-[#3F596C] sm:block"
              >
                Get started
              </Link>
            </div>
          </nav>
        </header>

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
              <div className="max-w-[610px] pt-5 lg:pt-12">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#9EADB7] bg-[#D9D8D2]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#526573] backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6B8FB1]" />
                  New city. New beginnings.
                </div>

                <h1 className="max-w-[650px] text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-[#263640] sm:text-6xl lg:text-[76px]">
                  A smoother move to a{" "}
                  <span className="text-[#6689A5]">brighter tomorrow.</span>
                </h1>

                <p className="mt-6 max-w-[560px] text-base leading-7 text-[#526573] sm:text-lg">
                  Find homes, plan your move, compare transport, and settle into
                  your next city with everything in one place.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
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
      </div>

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 overflow-hidden rounded-[28px] border border-[#BBC6CC] bg-[#D3D9DA]/70 shadow-[0_15px_45px_rgba(38,54,64,0.08)] md:grid-cols-4">
          <div className="border-b border-r border-[#BBC6CC] p-6 md:border-b-0">
            <Users className="mb-4 text-[#6689A5]" size={26} />
            <p className="text-3xl font-bold tracking-tight text-[#263640]">
              10K+
            </p>
            <p className="mt-1 text-xs font-medium text-[#687984]">
              Happy movers
            </p>
          </div>

          <div className="border-b border-[#BBC6CC] p-6 md:border-b-0 md:border-r">
            <House className="mb-4 text-[#6689A5]" size={26} />
            <p className="text-3xl font-bold tracking-tight text-[#263640]">
              500+
            </p>
            <p className="mt-1 text-xs font-medium text-[#687984]">
              Verified listings
            </p>
          </div>

          <div className="border-r border-[#BBC6CC] p-6">
            <MapPin className="mb-4 text-[#6689A5]" size={26} />
            <p className="text-3xl font-bold tracking-tight text-[#263640]">
              28+
            </p>
            <p className="mt-1 text-xs font-medium text-[#687984]">
              Cities in Odisha
            </p>
          </div>

          <div className="p-6">
            <ShieldCheck className="mb-4 text-[#6689A5]" size={26} />
            <p className="text-3xl font-bold tracking-tight text-[#263640]">
              4.8
            </p>
            <p className="mt-1 text-xs font-medium text-[#687984]">
              User experience
            </p>
          </div>
        </div>
      </section>

      <section
        id="homes"
        className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6689A5]">
              Everything in one place
            </span>

            <h2 className="mt-2 text-4xl font-bold tracking-[-0.04em] text-[#263640] sm:text-5xl">
              Make your move simpler.
            </h2>

            <p className="mt-3 max-w-xl text-[#667680]">
              From finding a room to reaching your new city, CityHop keeps your
              relocation journey organized.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#AEBCC5] bg-[#D8DCD9] px-5 py-3 text-sm font-bold text-[#415460] transition hover:bg-[#C8D0D4] sm:self-auto"
          >
            Explore CityHop
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-[28px] border border-[#BAC5CC] bg-[#D6DADB]/75 p-6 shadow-[0_14px_35px_rgba(38,54,64,0.06)] transition duration-300 hover:-translate-y-1 hover:bg-[#CFD5D8]"
              >
                <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B6C6D2] text-[#405B6D] transition group-hover:bg-[#6689A5] group-hover:text-[#E8ECF3]">
                  <Icon size={23} />
                </div>

                <h3 className="text-xl font-bold text-[#2D404B]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#6A7982]">
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-bold text-[#6689A5]">
                  Explore
                  <ArrowRight size={14} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="cities"
        className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12"
      >
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6689A5]">
            Popular destinations
          </span>

          <div className="mt-2 flex items-end justify-between gap-5">
            <h2 className="text-4xl font-bold tracking-[-0.04em] text-[#263640] sm:text-5xl">
              Find your next city.
            </h2>

            <Link
              href="/register"
              className="hidden items-center gap-1 text-sm font-bold text-[#526F85] sm:flex"
            >
              See all
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {cities.map((city) => (
            <article
              key={city.name}
              className="group overflow-hidden rounded-[30px] border border-[#B9C4CA] bg-[#D4D9D9] shadow-[0_18px_45px_rgba(38,54,64,0.08)]"
            >
              <div
                className={"relative h-64 overflow-hidden " + city.className}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#263640]/70 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <p className="text-2xl font-bold text-[#E8ECF3]">
                    {city.name}
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#D6E0E4]">
                    {city.subtitle}
                  </p>
                </div>

                <div className="absolute right-5 top-5 rounded-full bg-[#D7DBDA]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#40515B] backdrop-blur">
                  Odisha
                </div>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-bold text-[#3C4E58]">
                    Explore homes & areas
                  </p>

                  <p className="mt-1 text-xs text-[#71808A]">
                    Find your next place
                  </p>
                </div>

                <Link
                  href="/register"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6689A5] text-[#E8ECF3] transition group-hover:bg-[#526F85]"
                >
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="moving"
        className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12"
      >
        <div className="overflow-hidden rounded-[36px] border border-[#B6C2C8] bg-[#CBD3D5] shadow-[0_25px_60px_rgba(38,54,64,0.1)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6689A5]">
                Moving cost estimator
              </span>

              <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-[-0.045em] text-[#263640] sm:text-5xl">
                Know the cost before you move.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-[#62727C]">
                Compare your route, home size and transport options to get a
                practical estimate for your relocation.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#B4C0C6] bg-[#D7DAD8] p-4">
                  <MapPin size={18} className="mb-3 text-[#6689A5]" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71808A]">
                    Moving from
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#3C4D57]">
                    Bhubaneswar
                  </p>
                </div>

                <div className="rounded-2xl border border-[#B4C0C6] bg-[#D7DAD8] p-4">
                  <MapPin size={18} className="mb-3 text-[#6689A5]" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#71808A]">
                    Moving to
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#3C4D57]">
                    Cuttack
                  </p>
                </div>
              </div>

              <Link
                href="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#526F85] px-6 py-3.5 text-sm font-bold text-[#E8ECF3] transition hover:bg-[#3F596C]"
              >
                Get an estimate
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="relative min-h-[340px] overflow-hidden bg-gradient-to-br from-[#AFC1CD] via-[#91A9B9] to-[#627D91]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(222,228,227,0.4),transparent_25%)]" />

              <div className="absolute bottom-[-35px] left-[-10%] h-52 w-[120%] rotate-[-8deg] rounded-[50%] bg-[#566E7E]/70" />

              <div className="absolute bottom-24 right-16 h-24 w-44 rounded-[40%] border-[12px] border-[#C4CDCE]/70 rotate-[-5deg]" />

              <div className="absolute right-10 top-12 rounded-2xl border border-[#C9D3D6]/60 bg-[#D8DCD9]/80 p-5 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-[#60717B]">
                  Estimated range
                </p>

                <p className="mt-2 text-3xl font-bold text-[#30434E]">
                  ₹4.5K – ₹6.8K
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#63747D]">
                  <TrainFront size={15} />
                  Transport included
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="transport"
        className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[32px] border border-[#B9C4CA] bg-[#D3D8D9] p-7 shadow-[0_15px_40px_rgba(38,54,64,0.07)] sm:p-9">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6689A5]">
                  Transport
                </span>

                <h3 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#263640]">
                  Compare your route.
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8C8D3] text-[#526F85]">
                <BusFront size={23} />
              </div>
            </div>

            <div className="mt-7 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-[#BAC5CA] bg-[#DCE0DE]/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B7C7D1] text-[#526F85]">
                    <BusFront size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#3C4D57]">Bus</p>
                    <p className="text-xs text-[#71808A]">45 min – 1 hour</p>
                  </div>
                </div>

                <p className="text-sm font-bold text-[#526F85]">₹120 – ₹200</p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#BAC5CA] bg-[#DCE0DE]/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B7C7D1] text-[#526F85]">
                    <TrainFront size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#3C4D57]">Train</p>
                    <p className="text-xs text-[#71808A]">30 min – 50 min</p>
                  </div>
                </div>

                <p className="text-sm font-bold text-[#526F85]">₹115 – ₹180</p>
              </div>
            </div>

            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#526F85]"
            >
              Compare transport
              <ArrowRight size={15} />
            </Link>
          </div>

          <div
            id="about"
            className="relative overflow-hidden rounded-[32px] border border-[#B9C4CA] bg-[#CBD4D7] p-7 shadow-[0_15px_40px_rgba(38,54,64,0.07)] sm:p-9"
          >
            <div className="absolute right-[-60px] top-[-70px] h-56 w-56 rounded-full bg-[#9FB5C4]/40" />

            <div className="relative">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6689A5]">
                Why CityHop
              </span>

              <h3 className="mt-2 max-w-md text-3xl font-bold tracking-[-0.04em] text-[#263640]">
                One place for your next chapter.
              </h3>

              <p className="mt-4 max-w-lg leading-7 text-[#64747D]">
                CityHop brings homes, relocation planning and transport
                discovery together so you can focus on settling into your new
                city.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#D7DAD8]/75 p-4">
                  <ShieldCheck className="mb-3 text-[#6689A5]" size={21} />
                  <p className="text-sm font-bold text-[#3B4D57]">
                    Verified listings
                  </p>
                </div>

                <div className="rounded-2xl bg-[#D7DAD8]/75 p-4">
                  <MapPin className="mb-3 text-[#6689A5]" size={21} />
                  <p className="text-sm font-bold text-[#3B4D57]">
                    Odisha focused
                  </p>
                </div>

                <div className="rounded-2xl bg-[#D7DAD8]/75 p-4">
                  <CircleDollarSign className="mb-3 text-[#6689A5]" size={21} />
                  <p className="text-sm font-bold text-[#3B4D57]">
                    Cost planning
                  </p>
                </div>

                <div className="rounded-2xl bg-[#D7DAD8]/75 p-4">
                  <BusFront className="mb-3 text-[#6689A5]" size={21} />
                  <p className="text-sm font-bold text-[#3B4D57]">
                    Transport options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1440px] px-5 pb-8 pt-14 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-5 border-t border-[#B7C3C9] pt-7 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-bold text-[#334650]">CityHop</p>
            <p className="mt-1 text-xs text-[#71808A]">
              New city. New beginnings.
            </p>
          </div>

          <p className="text-xs text-[#71808A]">
            City relocation & hostel discovery platform
          </p>
        </div>
      </footer>
    </main>
  );
}
