"use client";

import { motion } from "framer-motion";
import { Building2, MapPinned, Users, Route } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: React.ElementType;
}

const stats: StatItem[] = [
  {
    label: "Cities",
    value: "—",
    icon: MapPinned,
  },
  {
    label: "Hostels",
    value: "—",
    icon: Building2,
  },
  {
    label: "Routes",
    value: "—",
    icon: Route,
  },
  {
    label: "Users",
    value: "—",
    icon: Users,
  },
];

export default function StatsSection(): React.ReactElement {
  return (
    <section className="bg-[#D6DADB] px-6 py-14 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="rounded-[28px] border border-[#B9C4CA] bg-[#E8ECF3] p-5 sm:p-6"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                <Icon size={21} strokeWidth={1.8} />
              </div>

              <p className="font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640] sm:text-4xl">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-[#667680]">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}