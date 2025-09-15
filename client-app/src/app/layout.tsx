import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarPage from "@/components/Navbar";
import AboutPage from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jyoh-App",
  description: "Document project",
};

export default function RootLayout({
  children,
  params, 
}: {
  children: React.ReactNode;
  params?: { lang?: string }; // Optional params
}) {
  const lang = params?.lang || "en"; // Default to 'en' if undefined
  console.log(params, "-->params");
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
        <NavbarPage  />
        {children}
        <AboutPage />
        </LanguageProvider>

      </body>
    </html>
  );
}
