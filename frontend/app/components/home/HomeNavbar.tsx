import Image from "next/image";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Moving",
    href: "/moving",
  },
  {
    label: "Transport",
    href: "/transport",
  },
  {
    label: "Cities",
    href: "/cities",
  },
  {
    label: "About",
    href: "/about",
  },
];

export default function HomeNavbar(): React.ReactElement {
  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <nav className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          aria-label="CityHop home"
          className="group inline-flex items-center"
        >
          <Image
            src="/logo.png"
            alt="CityHop"
            width={45}
            height={12}
            priority
            className="h-auto w-[42px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-[var(--font-nunito)] text-sm font-semibold text-[#526573] transition-colors duration-200 hover:text-[#263640]"
            >
              {item.label}

              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#526F85] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sign in */}
          <Link
            href="/login"
            className="group rounded-full border border-[#526F85]/25 bg-[#E8ECF3]/20 px-4 py-2.5 font-[var(--font-nunito)] text-sm font-semibold text-[#33444E] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#526F85]/40 hover:bg-[#E8ECF3]/40"
          >
            Sign in
          </Link>

          {/* Get started */}
          <Link
            href="/register"
            className="group hidden rounded-full bg-[#526F85] px-5 py-2.5 font-[var(--font-nunito)] text-sm font-semibold text-[#E8ECF3] shadow-lg shadow-[#526F85]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F596C] hover:shadow-xl sm:inline-flex sm:items-center sm:gap-2"
          >
            <span>Get started</span>

            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}