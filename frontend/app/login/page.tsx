"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../components/lib/auth/AuthProvider";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email: email.trim(),
        password,
      });
    } catch (loginError: unknown) {
      if (loginError instanceof Error) {
        setError(loginError.message);
      } else {
        setError("Unable to sign in. Please try again.");
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
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#CBD3D6] bg-[#D6DADB] shadow-[0_24px_70px_rgba(82,111,133,0.16)] lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left visual section */}
          <div className="relative hidden min-h-[620px] overflow-hidden bg-[#A7BDD3] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D3C8B8] opacity-70" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#6689A5] opacity-35" />

            <div className="relative z-10">
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
                Move with confidence
              </div>

              <h1 className="font-[var(--font-fredoka)] text-4xl font-bold leading-tight tracking-[-0.02em] text-[#263640] xl:text-5xl">
                Find your next place without the guesswork.
              </h1>

              <p className="mt-5 text-base leading-7 text-[#526F85]">
                Discover hostels, compare areas, understand your moving options,
                and plan your relocation from one place.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 text-sm text-[#526F85]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#526F85]" />
              Your relocation journey starts here.
            </div>
          </div>

          {/* Login section */}
          <div className="flex min-h-[620px] items-center bg-[#D6DADB] px-6 py-10 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-9 lg:hidden">
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

              <div className="mb-8">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#6689A5]">
                  Welcome back
                </p>

                <h2 className="font-[var(--font-fredoka)] text-3xl font-bold tracking-[-0.02em] text-[#263640] sm:text-4xl">
                  Sign in to CityHop
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#667680]">
                  Continue your search for a place that feels right.
                </p>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="mb-6 rounded-2xl border border-[#B9AFA3] bg-[#D3C8B8]/70 px-4 py-3 text-sm leading-5 text-[#526F85]"
                >
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#526F85]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
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
                      className="h-14 w-full rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6] pl-12 pr-4 text-[#263640] outline-none transition placeholder:text-[#7A878F] focus:border-[#6689A5] focus:bg-[#E1E5E7] focus:ring-4 focus:ring-[#A7BDD3]/35"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#526F85]"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-[#6689A5] transition hover:text-[#526F85]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667680]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-2xl border border-[#CBD3D6] bg-[#CBD3D6] pl-12 pr-12 text-[#263640] outline-none transition placeholder:text-[#7A878F] focus:border-[#6689A5] focus:bg-[#E1E5E7] focus:ring-4 focus:ring-[#A7BDD3]/35"
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
                        <EyeOff size={19} strokeWidth={1.8} />
                      ) : (
                        <Eye size={19} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#6689A5] px-5 font-medium text-[#E8ECF3] transition duration-200 hover:bg-[#526F85] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8ECF3]/40 border-t-[#E8ECF3]" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#CBD3D6]" />
                <span className="text-xs text-[#667680]">OR</span>
                <div className="h-px flex-1 bg-[#CBD3D6]" />
              </div>

              <p className="text-center text-sm text-[#667680]">
                Don`t have a CityHop account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#6689A5] transition hover:text-[#526F85]"
                >
                  Create one
                </Link>
              </p>

              <p className="mt-8 text-center text-xs leading-5 text-[#7A878F]">
                By continuing, you agree to use CityHop responsibly and keep
                your account information secure.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
