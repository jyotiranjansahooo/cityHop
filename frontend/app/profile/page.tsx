"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "../components/lib/auth/AuthProvider";
import {
  changeUserPassword,
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "../components/lib/api/profile";

export default function ProfilePage(): React.ReactElement {
  const router = useRouter();

  const {
    user,
    token,
    isAuthenticated,
    isLoading: authLoading,
    refreshUser,
  } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSaveError, setProfileSaveError] = useState("");

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !token) {
      router.replace("/login");
      return;
    }

    if (user?.role === "admin") {
      router.replace("/admin");
      return;
    }

    let cancelled = false;

    const loadProfile = async (): Promise<void> => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await getUserProfile(token);

        if (!cancelled) {
          setProfile(response.data);
          setName(response.data.name);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setProfileError(
            error instanceof Error
              ? error.message
              : "Unable to load your profile.",
          );
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, token, user?.role, router]);

  const handleProfileSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!token || !profile) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      setProfileSaveError("Please enter your name.");
      return;
    }

    try {
      setSavingProfile(true);
      setProfileSaveError("");
      setProfileMessage("");

      const response = await updateUserProfile(token, trimmedName);

      setProfile(response.data);
      setName(response.data.name);
      setProfileMessage(response.message);
      setEditing(false);

      await refreshUser();
    } catch (error: unknown) {
      setProfileSaveError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!token) {
      return;
    }

    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("The passwords do not match.");
      return;
    }

    try {
      setPasswordSaving(true);

      await changeUserPassword(token, currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setPasswordModalOpen(false);
    } catch (error: unknown) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Unable to change your password.",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const formatMemberDate = (date: string): string => {
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const openEditMode = (): void => {
    if (!profile) {
      return;
    }

    setName(profile.name);
    setProfileSaveError("");
    setProfileMessage("");
    setEditing(true);
  };

  const closeEditMode = (): void => {
    if (profile) {
      setName(profile.name);
    }

    setEditing(false);
    setProfileSaveError("");
  };

  const openPasswordModal = (): void => {
    setPasswordError("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setPasswordModalOpen(true);
  };

  const closePasswordModal = (): void => {
    if (passwordSaving) {
      return;
    }

    setPasswordModalOpen(false);
    setPasswordError("");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (authLoading || profileLoading) {
    return (
      <main className="min-h-[100svh] overflow-hidden bg-[#E8ECF3] px-5 pb-8 pt-[100px] sm:px-8">
        <div className="mx-auto grid h-full max-w-7xl animate-pulse items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="h-7 w-40 rounded-full bg-[#CBD3D6]" />

            <div className="mt-5 h-24 w-full max-w-xl rounded-3xl bg-[#CBD3D6]" />

            <div className="mt-4 h-5 w-full max-w-lg rounded-full bg-[#CBD3D6]" />

            <div className="mt-7 h-[500px] rounded-[30px] bg-[#D6DADB]" />
          </div>

          <div className="hidden h-[calc(100svh-125px)] min-h-[600px] rounded-[42px] bg-[#D6DADB] lg:block" />
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-[#E8ECF3] px-5">
        <div className="w-full max-w-lg rounded-[32px] border border-white/80 bg-white/75 p-8 text-center shadow-xl backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE7F0]">
            <UserRound className="h-6 w-6 text-[#587590]" />
          </div>

          <h1 className="mt-5 font-[var(--font-fredoka)] text-3xl font-semibold text-[#263640]">
            Unable to load your profile
          </h1>

          <p className="mt-3 font-[var(--font-nunito)] text-sm leading-6 text-[#667680]">
            {profileError || "Please try again."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[#6689A5] px-6 py-3 font-[var(--font-nunito)] text-sm font-bold text-white transition hover:bg-[#587B98]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const initial = profile.name.trim().charAt(0).toUpperCase();

  return (
    <>
      <main className="relative h-[100svh] overflow-hidden bg-[#E8ECF3] px-5 pt-[88px] sm:px-8">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-56 top-24 h-[520px] w-[520px] rounded-full bg-[#A7BDD3]/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-56 bottom-[-180px] h-[600px] w-[600px] rounded-full bg-white/50 blur-3xl" />

        <div className="relative mx-auto h-full max-w-7xl">
          <div className="grid h-full min-h-0 items-center gap-7 lg:grid-cols-[0.9fr_1.1fr] xl:gap-10">
            {/* ================================================= */}
            {/* LEFT SIDE */}
            {/* ================================================= */}

            <section className="flex min-h-0 flex-col justify-center">
              {/* Label */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#D7E2ED] px-4 py-2 font-[var(--font-nunito)] text-[11px] font-bold uppercase tracking-[0.2em] text-[#58718B]">
                <span>EXPLORE</span>
                <span>•</span>
                <span>PLAN</span>
                <span>•</span>
                <span>MOVE</span>
              </div>

              {/* Heading */}
              <h1 className="mt-5 font-[var(--font-fredoka)] text-[44px] font-semibold leading-[0.94] tracking-[-0.035em] text-[#102338] sm:text-[52px] xl:text-[58px]">
                Your
                <br />
                <span className="text-[#6689A5]">CityHop</span> Profile
              </h1>

              <p className="mt-4 max-w-xl font-[var(--font-nunito)] text-base leading-6 text-[#5D7390] sm:text-lg">
                Manage your account, keep your information up to date and
                continue planning your next journey across Odisha.
              </p>

              {/* Profile card */}
              <div className="mt-6 max-w-[620px] rounded-[30px] border border-white/80 bg-white/70 p-4 shadow-[0_22px_65px_rgba(76,104,130,0.13)] backdrop-blur-xl sm:p-5">
                {/* User header */}
                <div className="flex items-center justify-between gap-4 border-b border-[#B8C9D8]/40 pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#6689A5] to-[#526F85] shadow-lg shadow-[#526F85]/20">
                      <span className="font-[var(--font-fredoka)] text-2xl font-semibold text-white">
                        {initial}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-[var(--font-fredoka)] text-xl font-semibold text-[#263640] sm:text-2xl">
                          {profile.name}
                        </h2>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCEDE3] px-2.5 py-1 font-[var(--font-nunito)] text-[10px] font-bold text-[#47745C]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4D8B68]" />
                          Active
                        </span>
                      </div>

                      <p className="mt-0.5 truncate font-[var(--font-nunito)] text-xs text-[#718397] sm:text-sm">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  {!editing ? (
                    <button
                      type="button"
                      onClick={openEditMode}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E5EDF4] text-[#58718B] transition hover:bg-[#D9E5EF]"
                      aria-label="Edit profile"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                {/* Profile fields */}
                <form onSubmit={handleProfileSubmit}>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {/* Name */}
                    <div className="flex min-w-0 items-center gap-3 rounded-[17px] border border-[#C5D2DF]/60 bg-white/50 px-3.5 py-3">
                      <UserRound className="h-5 w-5 shrink-0 text-[#607991]" />

                      <div className="min-w-0 flex-1">
                        <p className="font-[var(--font-nunito)] text-[10px] text-[#8494A5]">
                          Full Name
                        </p>

                        {editing ? (
                          <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="mt-0.5 w-full bg-transparent font-[var(--font-nunito)] text-sm font-bold text-[#52687D] outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="mt-0.5 truncate font-[var(--font-nunito)] text-sm font-bold text-[#52687D]">
                            {profile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex min-w-0 items-center gap-3 rounded-[17px] border border-[#C5D2DF]/60 bg-white/50 px-3.5 py-3">
                      <Mail className="h-5 w-5 shrink-0 text-[#607991]" />

                      <div className="min-w-0">
                        <p className="font-[var(--font-nunito)] text-[10px] text-[#8494A5]">
                          Email Address
                        </p>

                        <p className="mt-0.5 truncate font-[var(--font-nunito)] text-sm font-bold text-[#52687D]">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    {/* Region */}
                    <div className="flex min-w-0 items-center gap-3 rounded-[17px] border border-[#C5D2DF]/60 bg-white/50 px-3.5 py-3">
                      <MapPin className="h-5 w-5 shrink-0 text-[#607991]" />

                      <div>
                        <p className="font-[var(--font-nunito)] text-[10px] text-[#8494A5]">
                          CityHop Region
                        </p>

                        <p className="mt-0.5 font-[var(--font-nunito)] text-sm font-bold text-[#52687D]">
                          Odisha
                        </p>
                      </div>
                    </div>

                    {/* Member since */}
                    <div className="flex min-w-0 items-center gap-3 rounded-[17px] border border-[#C5D2DF]/60 bg-white/50 px-3.5 py-3">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-[#607991]" />

                      <div className="min-w-0">
                        <p className="font-[var(--font-nunito)] text-[10px] text-[#8494A5]">
                          Member Since
                        </p>

                        <p className="mt-0.5 truncate font-[var(--font-nunito)] text-sm font-bold text-[#52687D]">
                          {formatMemberDate(profile.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="mt-2.5 flex items-center justify-between gap-3 rounded-[17px] border border-[#C5D2DF]/60 bg-white/50 px-3.5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E2EBF2] text-[#58718B]">
                        <LockKeyhole className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-[var(--font-nunito)] text-[10px] text-[#8494A5]">
                          Security
                        </p>

                        <p className="truncate font-[var(--font-nunito)] text-sm font-bold text-[#52687D]">
                          Password protected
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={openPasswordModal}
                      className="shrink-0 rounded-xl bg-[#E3ECF4] px-3.5 py-2 font-[var(--font-nunito)] text-[11px] font-bold text-[#526F85] transition hover:bg-[#D6E3ED]"
                    >
                      Change
                    </button>
                  </div>

                  {/* Edit buttons */}
                  {editing ? (
                    <div className="mt-3 flex gap-2.5">
                      <button
                        type="button"
                        onClick={closeEditMode}
                        className="flex-1 rounded-[15px] border border-[#B8C9D8]/60 bg-white/60 px-4 py-3 font-[var(--font-nunito)] text-sm font-bold text-[#52687D] transition hover:bg-white"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="flex-1 rounded-[15px] bg-[#6689A5] px-4 py-3 font-[var(--font-nunito)] text-sm font-bold text-white shadow-lg shadow-[#6689A5]/20 transition hover:bg-[#587B98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  ) : null}
                </form>

                {/* Success */}
                {profileMessage ? (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#E1F0E7] px-3 py-2.5 font-[var(--font-nunito)] text-xs font-semibold text-[#47745C]">
                    <Check className="h-3.5 w-3.5" />
                    {profileMessage}
                  </div>
                ) : null}

                {/* Error */}
                {profileSaveError ? (
                  <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 font-[var(--font-nunito)] text-xs font-semibold text-red-600">
                    {profileSaveError}
                  </p>
                ) : null}
              </div>
            </section>

            {/* ================================================= */}
            {/* RIGHT SIDE */}
            {/* ================================================= */}

          <section className="relative hidden h-[calc(100svh-118px)] min-h-0 max-h-[780px] lg:block">

  {/* ===================================================== */}
  {/* LARGE BACKGROUND BLOB */}
  {/* ===================================================== */}

  <div
    className="absolute -inset-x-4 -bottom-2 -top-5 bg-[#C8DCEE]"
    style={{
      borderRadius:
        "42% 58% 52% 48% / 28% 32% 68% 72%",
    }}
  />

  {/* Soft blob shadow */}
  <div
    className="pointer-events-none absolute -inset-x-6 -bottom-4 -top-7 -z-10 bg-[#91B1CA]/30 blur-3xl"
    style={{
      borderRadius:
        "42% 58% 52% 48% / 28% 32% 68% 72%",
    }}
  />

  {/* ===================================================== */}
  {/* ROUTE HEADER — OUTSIDE IMAGE, BUT INSIDE LARGE BLOB */}
  {/* ===================================================== */}

  <div className="absolute left-3 right-3 top-1 z-50 flex items-start justify-between">

    {/* Bhubaneswar */}
    <div className="flex flex-col items-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/90 bg-white/90 shadow-md">
        <MapPin className="h-5 w-5 text-[#527696]" />
      </div>

      <span className="mt-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-1 font-[var(--font-nunito)] text-[11px] font-bold text-[#526F85] shadow-sm">
        Bhubaneswar
      </span>
    </div>

    {/* Your Journey */}
    <div className="mt-5 flex flex-col items-center">
      <div className="flex items-center gap-2">
        <span className="w-12 border-t-2 border-dashed border-[#6689A5]/60 xl:w-20" />

        <span className="whitespace-nowrap font-[var(--font-nunito)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#6689A5]">
          Your Journey
        </span>

        <span className="w-12 border-t-2 border-dashed border-[#6689A5]/60 xl:w-20" />
      </div>
    </div>

    {/* Puri */}
    <div className="flex flex-col items-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/90 bg-white/90 shadow-md">
        <MapPin className="h-5 w-5 text-[#527696]" />
      </div>

      <span className="mt-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-1 font-[var(--font-nunito)] text-[11px] font-bold text-[#526F85] shadow-sm">
        Puri
      </span>
    </div>

  </div>

  {/* ===================================================== */}
  {/* IMAGE — SEPARATE FROM HEADER */}
  {/* ===================================================== */}

  <div
    className="absolute left-[2%] right-[2%] top-[18%] bottom-[14%] overflow-hidden"
    style={{
      borderRadius:
        "45% 55% 52% 48% / 34% 38% 62% 66%",
    }}
  >

    {/* Image loading */}
    {imageLoading && !imageError ? (
      <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#DDEAF6] via-[#C5DBEB] to-[#A9C4DA]">

        <div className="absolute inset-0 animate-pulse bg-white/10" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/80 bg-white/75 shadow-xl backdrop-blur-xl">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#6689A5]/25 border-t-[#6689A5]" />
            </div>

            <div className="mt-4 rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow-sm">
              <p className="font-[var(--font-nunito)] text-xs font-bold text-[#526F85]">
                Loading Odisha...
              </p>
            </div>

          </div>
        </div>

      </div>
    ) : null}

    {/* Real image */}
    {!imageError ? (
      <Image
        src="/images/cityhop-profile.png"
        alt="Odisha coastal road, beach and Jagannath temple"
        fill
        priority
        sizes="(min-width: 1280px) 55vw, 50vw"
        className={
          "object-cover object-center transition-all duration-700 " +
          (imageLoading
            ? "scale-[1.03] opacity-0"
            : "scale-100 opacity-100")
        }
        onLoad={() => {
          setImageLoading(false);
        }}
        onError={() => {
          setImageLoading(false);
          setImageError(true);
        }}
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#DCEAF6] to-[#A9C4DA]">

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/80">
            <MapPin className="h-6 w-6 text-[#6689A5]" />
          </div>

          <p className="mt-4 font-[var(--font-fredoka)] text-lg font-semibold text-[#526F85]">
            Odisha image unavailable
          </p>

          <p className="mt-1 font-[var(--font-nunito)] text-xs text-[#718397]">
            Check public/images/cityhop-profile.png
          </p>
        </div>

      </div>
    )}

    {!imageError ? (
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#263640]/15 via-transparent to-white/10" />
    ) : null}

  </div>

  {/* ===================================================== */}
  {/* SAME ROADS / NEW STORIES */}
  {/* ===================================================== */}

  <div className="absolute right-[5%] top-[28%] z-50 rotate-[-4deg] text-right">

    <p className="font-[var(--font-fredoka)] text-xl font-semibold leading-tight text-[#527696] xl:text-2xl">
      Same Roads
    </p>

    <p className="font-[var(--font-fredoka)] text-xl font-semibold leading-tight text-[#527696] xl:text-2xl">
      New Stories
    </p>

    <div className="ml-auto mt-2 h-1 w-28 rotate-[-5deg] rounded-full bg-[#527696]/60" />

  </div>

  {/* ===================================================== */}
  {/* BOTTOM FEATURES */}
  {/* ===================================================== */}

  <div className="absolute bottom-0 left-0 right-0 z-50 rounded-[24px] border border-white/90 bg-white/80 p-2.5 shadow-[0_20px_50px_rgba(76,104,130,0.15)] backdrop-blur-xl">

    <div className="grid grid-cols-3 divide-x divide-[#9EB2C4]/40">

      <Feature
        icon={<MapPin className="h-4 w-4" />}
        title="Plan Routes"
        subtitle="Bus, Train, Car"
      />

      <Feature
        icon={<ShieldCheck className="h-4 w-4" />}
        title="Stay Secure"
        subtitle="Protected account"
      />

      <Feature
        icon={<ArrowRight className="h-4 w-4" />}
        title="Keep Moving"
        subtitle="Explore Odisha"
      />

    </div> 

  </div>

</section>
          </div>
        </div>
      </main>


      {passwordModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#152535]/45 px-5 py-6 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[30px] border border-white/80 bg-[#F4F7FA] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCE7F0] text-[#577590]">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <h2 className="mt-4 font-[var(--font-fredoka)] text-2xl font-semibold text-[#263640]">
                  Change password
                </h2>

                <p className="mt-1 font-[var(--font-nunito)] text-sm text-[#718397]">
                  Keep your CityHop account secure.
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={passwordSaving}
                className="rounded-full bg-[#E3EBF2] px-3 py-2 font-[var(--font-nunito)] text-xs font-bold text-[#52687D] transition hover:bg-[#D8E4EC] disabled:opacity-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-3">
              <PasswordField
                id="current-password"
                label="Current Password"
                value={currentPassword}
                visible={showCurrentPassword}
                onChange={setCurrentPassword}
                onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
              />

              <PasswordField
                id="new-password"
                label="New Password"
                value={newPassword}
                visible={showNewPassword}
                onChange={setNewPassword}
                onToggle={() => setShowNewPassword(!showNewPassword)}
              />

              <PasswordField
                id="confirm-password"
                label="Confirm Password"
                value={confirmPassword}
                visible={showConfirmPassword}
                onChange={setConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <p className="px-1 font-[var(--font-nunito)] text-[11px] text-[#8494A5]">
                Your new password must contain at least 8 characters.
              </p>

              {passwordError ? (
                <p className="rounded-xl bg-red-50 px-3 py-2.5 font-[var(--font-nunito)] text-xs font-semibold text-red-600">
                  {passwordError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={passwordSaving}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#6689A5] px-5 py-3.5 font-[var(--font-nunito)] text-sm font-bold text-white shadow-lg shadow-[#6689A5]/20 transition hover:bg-[#587B98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordSaving ? "Updating..." : "Update Password"}

                {!passwordSaving ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ========================================================= */
/* FEATURE ITEM */
/* ========================================================= */

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function Feature({ icon, title, subtitle }: FeatureProps): React.ReactElement {
  return (
    <div className="px-2 py-2 text-center sm:px-4">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#D8E6F1] text-[#5B7B99]">
        {icon}
      </div>

      <p className="mt-1.5 font-[var(--font-nunito)] text-[11px] font-bold text-[#263640] sm:text-xs">
        {title}
      </p>

      <p className="mt-0.5 hidden font-[var(--font-nunito)] text-[10px] text-[#687E93] sm:block">
        {subtitle}
      </p>
    </div>
  );
}

/* ========================================================= */
/* PASSWORD FIELD */
/* ========================================================= */

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

function PasswordField({
  id,
  label,
  value,
  visible,
  onChange,
  onToggle,
}: PasswordFieldProps): React.ReactElement {
  return (
    <div className="rounded-[17px] border border-[#C5D2DF]/60 bg-white px-4 py-3">
      <label
        htmlFor={id}
        className="font-[var(--font-nunito)] text-[11px] text-[#8494A5]"
      >
        {label}
      </label>

      <div className="mt-1 flex items-center gap-2">
        <KeyRound className="h-4 w-4 shrink-0 text-[#607991]" />

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent font-[var(--font-nunito)] text-sm font-semibold text-[#263640] outline-none"
        />

        <button
          type="button"
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#718397] transition hover:bg-[#E8EEF3]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
