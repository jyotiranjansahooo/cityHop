"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Explore Cities", href: "/explore" },
      { label: "Find a Hostel", href: "/explore" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
];

export default function HomeFooter(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="min-h-[40vh] overflow-hidden bg-[#263640] text-[#E8ECF3]">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-14">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] bg-[#526F85] px-6 py-7 sm:px-8 sm:py-8 lg:px-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#A7BDD3]/20" />

          <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="mb-2 inline-flex rounded-full bg-[#E8ECF3]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D6E1E8]">
                Your next move
              </span>

              <h2 className="font-[var(--font-fredoka)] text-2xl font-semibold leading-tight text-[#E8ECF3] sm:text-3xl lg:text-4xl">
                Ready to find your next place?
              </h2>

              <p className="mt-2 max-w-lg text-xs leading-5 text-[#D6E1E8] sm:text-sm">
                Explore destinations, discover places to stay and plan your move
                with CityHop.
              </p>
            </div>

            <Link href="/explore" className="shrink-0">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 rounded-full bg-[#E8ECF3] px-5 py-3 text-sm font-bold text-[#263640] shadow-md"
              >
                <span>Explore</span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A7BDD3]">
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Footer content */}
        <div className="grid gap-7 border-b border-[#526F85]/40 py-7 sm:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex">
              <motion.img
                src="/logo.png"
                alt="CityHop"
                className="w-[60px] object-contain"
                whileHover={{ scale: 1.05 }}
              />
            </Link>

            <p className="mt-3 max-w-xs text-xs leading-5 text-[#A7BDD3]">
              Explore destinations, find a place to stay and plan your next move
              with CityHop.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A7BDD3]">
                {group.title}
              </p>

              <nav className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex w-fit items-center gap-1.5 text-xs text-[#E8ECF3] transition-colors hover:text-[#D3C8B8]"
                  >
                    {link.label}

                    <ArrowUpRight
                      size={11}
                      className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-[10px] text-[#A7BDD3]">© {currentYear} CityHop</p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-[10px] text-[#A7BDD3] hover:text-[#E8ECF3]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-[10px] text-[#A7BDD3] hover:text-[#E8ECF3]"
            >
              Terms
            </Link>

            <Link href="/explore">
              <motion.div
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A7BDD3] text-[#263640]"
              >
                <ArrowUpRight size={15} />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
