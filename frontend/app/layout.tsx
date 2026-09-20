import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./components/lib/auth/AuthProvider";

export const metadata: Metadata = {
  title: "CityHop",
  description: "City relocation and hostel discovery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

