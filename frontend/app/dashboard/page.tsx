"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Map, MapPin, Train, UserRound } from "lucide-react";

import { useAuth } from "../components/lib/auth/AuthProvider";
import Skeleton from "../components/ui/Skeleton";

export default function DashboardPage(): React.ReactElement {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-[#E8ECF3] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-4 h-5 w-96 max-w-full" />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        </div>
      </main>
    );
  }

 if (user.role === "admin") {
  router.replace("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#E8ECF3]">
      <Skeleton className="h-10 w-10 rounded-full" />
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#E8ECF3] px-5 py-28 text-[#263640] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[32px] border border-[#CBD3D6] bg-[#D6DADB] p-7 shadow-[0_20px_60px_rgba(82,111,133,0.10)] sm:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#6689A5]">
                Your CityHop
              </p>

              <h1 className="mt-2 font-[var(--font-fredoka)] text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
                Welcome, {user.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667680] sm:text-base">
                Explore cities, compare areas, discover places to stay, and plan
                your next move.
              </p>
            </div>

            <Link
              href="/cities"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#6689A5] px-5 text-sm font-semibold text-[#E8ECF3] transition hover:bg-[#526F85]"
            >
              Explore cities
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <section className="mt-7 grid gap-5 md:grid-cols-3">
          <DashboardAction
            href="/moving"
            icon={<MapPin size={22} />}
            title="Plan your move"
            description="Choose where you are moving from and where you want to go."
          />

          <DashboardAction
            href="/transport"
            icon={<Train size={22} />}
            title="Find transport"
            description="Search transport options between your selected locations."
          />

          <DashboardAction
            href="/cities"
            icon={<Map size={22} />}
            title="Explore cities"
            description="Discover cities and explore available areas and stays."
          />
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[28px] border border-[#CBD3D6] bg-[#D6DADB] p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-[var(--font-fredoka)] text-xl font-semibold">
                  Your profile
                </h2>

                <p className="text-sm text-[#667680]">Account information</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ProfileItem label="Name" value={user.name} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Account type" value="User" />
              <ProfileItem
                label="Account status"
                value={user.isActive ? "Active" : "Inactive"}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-[#CBD3D6] bg-[#D6DADB] p-7">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#6689A5]">
              Getting started
            </p>

            <h2 className="mt-2 font-[var(--font-fredoka)] text-xl font-semibold">
              Plan your relocation
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#667680]">
              Start by selecting your destination and exploring what the city
              has to offer.
            </p>

            <Link
              href="/moving"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#526F85] transition hover:text-[#6689A5]"
            >
              Start planning
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

interface DashboardActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function DashboardAction({
  href,
  icon,
  title,
  description,
}: DashboardActionProps): React.ReactElement {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-[#CBD3D6] bg-[#D6DADB] p-7 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(82,111,133,0.12)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#A7BDD3] text-[#526F85]">
        {icon}
      </div>

      <h2 className="mt-5 font-[var(--font-fredoka)] text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#667680]">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#526F85]">
        Open
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

interface ProfileItemProps {
  label: string;
  value: string;
}

function ProfileItem({ label, value }: ProfileItemProps): React.ReactElement {
  return (
    <div className="rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6]/60 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#7A878F]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#263640]">
        {value}
      </p>
    </div>
  );
}
