import type { Metadata } from "next";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/500.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "./globals.css";

import HomeNavbar from "./components/home/HomeNavbar";
import HomeFooter from "./components/home/HomeFooter";
import { AuthProvider } from "./components/lib/auth/AuthProvider";
import { siteMetadata } from "./metadata";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body className="font-[var(--font-nunito)]">
        <AuthProvider>
          <HomeNavbar />

          {children}

          <HomeFooter />
        </AuthProvider>
      </body>
    </html>
  );
}