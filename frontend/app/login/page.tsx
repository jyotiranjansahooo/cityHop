"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/components/lib/auth/AuthProvider";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();

  const { login, isAuthenticated, user, isLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (user.role === "owner") {
      router.replace("/owner");
      return;
    }

    router.replace("/dashboard");
  }, [isAuthenticated, isLoading, router, user]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setIsSubmitting(true);

      const loggedInUser = await login({
        email: email.trim(),
        password,
      });

      if (loggedInUser.role === "admin") {
        router.replace("/admin");
        return;
      }

      if (loggedInUser.role === "owner") {
        router.replace("/owner");
        return;
      }

      router.replace("/dashboard");
    } catch (submitError: unknown) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#A8C5B8] border-t-[#3F7D7A]" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[#A8C5B8]/40 bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3F7D7A] text-2xl font-bold text-white">
              C
            </div>

            <h1 className="text-3xl font-bold text-[#243B3A]">Welcome back</h1>

            <p className="mt-2 text-sm text-[#243B3A]/60">
              Sign in to continue your CityHop journey
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#243B3A]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded-xl border border-[#A8C5B8] bg-[#F7F5EF]/50 px-4 py-3 text-[#243B3A] outline-none transition focus:border-[#3F7D7A] focus:ring-2 focus:ring-[#3F7D7A]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#243B3A]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-[#A8C5B8] bg-[#F7F5EF]/50 px-4 py-3 text-[#243B3A] outline-none transition focus:border-[#3F7D7A] focus:ring-2 focus:ring-[#3F7D7A]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#3F7D7A] px-4 py-3 font-semibold text-white transition hover:bg-[#243B3A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#243B3A]/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#3F7D7A] hover:text-[#243B3A]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
