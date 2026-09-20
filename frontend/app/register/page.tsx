"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/components/lib/auth/AuthProvider";

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();

  const { register, isAuthenticated, user, isLoading } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
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

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      const registeredUser = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (registeredUser.role === "admin") {
        router.replace("/admin");
        return;
      }

      if (registeredUser.role === "owner") {
        router.replace("/owner");
        return;
      }

      router.replace("/dashboard");
    } catch (submitError: unknown) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Unable to create your account. Please try again.");
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

            <h1 className="text-3xl font-bold text-[#243B3A]">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-[#243B3A]/60">
              Start exploring places with CityHop
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
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#243B3A]"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-xl border border-[#A8C5B8] bg-[#F7F5EF]/50 px-4 py-3 text-[#243B3A] outline-none transition focus:border-[#3F7D7A] focus:ring-2 focus:ring-[#3F7D7A]/20"
              />
            </div>

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
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#A8C5B8] bg-[#F7F5EF]/50 px-4 py-3 text-[#243B3A] outline-none transition focus:border-[#3F7D7A] focus:ring-2 focus:ring-[#3F7D7A]/20"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[#243B3A]"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#A8C5B8] bg-[#F7F5EF]/50 px-4 py-3 text-[#243B3A] outline-none transition focus:border-[#3F7D7A] focus:ring-2 focus:ring-[#3F7D7A]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#3F7D7A] px-4 py-3 font-semibold text-white transition hover:bg-[#243B3A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#243B3A]/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#3F7D7A] hover:text-[#243B3A]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
