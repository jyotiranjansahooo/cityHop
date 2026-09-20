import HomeNavbar from "./components/home/HomeNavbar";
import HeroSection from "./components/home/HeroSection";

export default function HomePage(): React.ReactElement {
  return (
    <main className="min-h-screen overflow-hidden bg-[#E8ECF3] text-[#263640]">
      <div className="relative">
        <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-[#A7BDD3]/30 blur-3xl" />

        <div className="pointer-events-none absolute right-[-10rem] top-20 h-[30rem] w-[30rem] rounded-full bg-[#D3C8B8]/35 blur-3xl" />

        <HomeNavbar />

        <HeroSection />
      </div>
    </main>
  );
}
