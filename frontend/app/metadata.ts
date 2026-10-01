import type { Metadata } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),

  title: {
    default: "CityHop",
    template: "%s | CityHop",
  },

  description:
    "CityHop helps you explore cities, discover places to stay, plan transportation, and make your next move easier.",

  keywords: [
    "CityHop",
    "Odisha",
    "Odisha cities",
    "hostels in Odisha",
    "city relocation",
    "hostel discovery",
    "transportation",
    "travel planning",
  ],

  authors: [
    {
      name: "CityHop",
    },
  ],

  creator: "CityHop",
  publisher: "CityHop",

  applicationName: "CityHop",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  openGraph: {
    type: "website",
    siteName: "CityHop",
    title: "CityHop",
    description:
      "Explore cities, discover places to stay, plan transportation, and make your next move easier.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CityHop",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CityHop",
    description:
      "Explore cities, discover places to stay, and plan your next move with CityHop.",
    images: ["/og-image.png"],
  },

  category: "travel",
};