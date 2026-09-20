"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useAuth } from "../components/lib/auth/AuthProvider";

export default function RegisterPage(): React.ReactElement {
  const router = useRouter();
  const { register, user, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") {
        router.replace("/admin");
        return;
      }

      if (user.role === "owner") {
        router.replace("/owner");
        return;
      }

      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch (registerError: unknown) {
      if (registerError instanceof Error) {
        setError(registerError.message);
      } else {
        setError("Unable to create your account. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#E8ECF3] px-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#CBD3D6] border-t-[#6689A5]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#E8ECF3] text-[#263640]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#CBD3D6] bg-[#D6DADB] shadow-[0_24px_70px_rgba(82,111,133,0.16)] lg:grid-cols-[1.1fr_0.9fr]">
          {/* Registration form */}
          <div className="flex min-h-[650px] items-center bg-[#D6DADB] px-6 py-10 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              {/* Mobile logo */}
              <div className="mb-8 lg:hidden">
                <Link href="/" className="inline-flex items-center">
                  <Image
                    src="/logo.png"
                    alt="CityHop"
                    width={60}
                    height={20}
                    priority
                    className="h-auto w-[60px] object-contain"
                  />
                </Link>
              </div>

              <div className="mb-7">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#6689A5]">
                  Get started
                </p>

                <h1 className="font-[var(--font-fredoka)] text-3xl font-bold tracking-[-0.02em] text-[#263640] sm:text-4xl">
                  Create your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#667680]">
                  Join CityHop and start planning your next move.
                </p>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="mb-5 rounded-2xl border border-[#B9AFA3] bg-[#D3C8B8]/70 px-4 py-3 text-sm leading-5 text-[#526F85]"
                >
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#526F85]"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667680]"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className="h-13 w-full rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6] pl-12 pr-4 text-[#263640] outline-none transition placeholder:text-[#7A878F] focus:border-[#6689A5] focus:bg-[#E1E5E7] focus:ring-4 focus:ring-[#A7BDD3]/35"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#526F85]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667680]"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-13 w-full rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6] pl-12 pr-4 text-[#263640] outline-none transition placeholder:text-[#7A878F] focus:border-[#6689A5] focus:bg-[#E1E5E7] focus:ring-4 focus:ring-[#A7BDD3]/35"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[#526F85]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667680]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      className="h-13 w-full rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6] pl-12 pr-12 text-[#263640] outline-none transition placeholder:text-[#7A878F] focus:border-[#6689A5] focus:bg-[#E1E5E7] focus:ring-4 focus:ring-[#A7BDD3]/35"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667680] transition hover:text-[#526F85]"
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={1.8} />
                      ) : (
                        <Eye size={18} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-[#526F85]"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667680]"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repeat your password"
                      className="h-13 w-full rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6] pl-12 pr-12 text-[#263640] outline-none transition placeholder:text-[#7A878F] focus:border-[#6689A5] focus:bg-[#E1E5E7] focus:ring-4 focus:ring-[#A7BDD3]/35"
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667680] transition hover:text-[#526F85]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} strokeWidth={1.8} />
                      ) : (
                        <Eye size={18} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#6689A5] px-5 font-medium text-[#E8ECF3] transition duration-200 hover:bg-[#526F85] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8ECF3]/40 border-t-[#E8ECF3]" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#CBD3D6]" />
                <span className="text-xs text-[#667680]">OR</span>
                <div className="h-px flex-1 bg-[#CBD3D6]" />
              </div>

              <p className="text-center text-sm text-[#667680]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#6689A5] transition hover:text-[#526F85]"
                >
                  Sign in
                </Link>
              </p>

              <p className="mt-6 text-center text-xs leading-5 text-[#7A878F]">
                By creating an account, you agree to use CityHop responsibly and
                keep your account information secure.
              </p>
            </div>
          </div>

          {/* Right visual section */}
          <div className="relative hidden min-h-[650px] overflow-hidden bg-[#A7BDD3] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D3C8B8] opacity-70" />

            <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#6689A5] opacity-35" />

            <div className="relative z-10 flex justify-end">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/logo.png"
                  alt="CityHop"
                  width={65}
                  height={22}
                  priority
                  className="h-auto w-[65px] object-contain"
                />
              </Link>
            </div>

            <div className="relative z-10 max-w-sm">
              <div className="mb-5 inline-flex rounded-full border border-[#526F85]/20 bg-[#E8ECF3]/40 px-4 py-2 text-sm font-medium text-[#526F85] backdrop-blur-sm">
                Your journey starts here
              </div>

              <h2 className="font-[var(--font-fredoka)] text-4xl font-bold leading-tight tracking-[-0.02em] text-[#263640] xl:text-5xl">
                One place for your next move.
              </h2>

              <p className="mt-5 text-base leading-7 text-[#526F85]">
                Find a home, discover hostels, compare locations, and understand
                the cost of moving to your next destination.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 text-sm text-[#526F85]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#526F85]" />
              Explore. Compare. Move.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
