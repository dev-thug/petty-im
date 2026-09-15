import type { MetadataRoute } from "next";
import { landingLocales } from "@/content/landing-locales";

// Matches the landing page ground so the splash and address bar blend in.
const INK = "#070819";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Petty",
    short_name: "Petty",
    description: landingLocales.ko.META.description,
    start_url: "/",
    // This is the marketing site, not the app at app.petty.im: a home-screen
    // shortcut to it should keep the browser UI rather than pose as the app.
    display: "browser",
    background_color: INK,
    theme_color: INK,
    icons: [
      { src: "/assets/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/app-icon-512.png", sizes: "512x512", type: "image/png" },
      {
        // Full frame: the cat and bubble stay inside the 80% safe circle.
        src: "/assets/app-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
