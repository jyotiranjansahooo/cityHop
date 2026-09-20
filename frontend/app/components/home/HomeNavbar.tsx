import Image from "next/image";
import Link from "next/link";

export default function HomeNavbar(): React.ReactElement {
  return (
    <header className="relative z-20 mx-auto max-w-[1440px] px-5 py-3 sm:px-8 lg:px-12">
      <nav className="flex items-center justify-between rounded-[28px] border border-[#B9C6D0]/70 bg-[#D9DEE1]/70 px-5 py-4 shadow-[0_12px_40px_rgba(38,54,64,0.08)] backdrop-blur-xl sm:px-7">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logo.png"
            alt="CityHop"
            width={45}
            height={12}
            priority
            className="h-auto w-[40px] object-contain"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link
            href="#homes"
            className="text-sm font-medium text-[#526573] transition hover:text-[#263640]"
          >
            Home
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
  );
}
