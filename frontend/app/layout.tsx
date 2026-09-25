import type { Metadata } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import "./globals.css";
import HomeNavbar from "./components/home/HomeNavbar";
import HomeFooter from "./components/home/HomeFooter";
import { AuthProvider } from "./components/lib/auth/AuthProvider";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CityHop",
  description:
    "Explore cities, find places to stay and plan your next move with CityHop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body
        className={
          fredoka.variable +
          " " +
          nunitoSans.variable +
          " font-[var(--font-nunito)]"
        }
      >
        <AuthProvider>
          <HomeNavbar />

          {children}

          <HomeFooter />
        </AuthProvider>
      </body>
    </html>
  );
}