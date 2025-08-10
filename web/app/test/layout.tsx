// RootLayout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat_Alternates, Nunito } from "next/font/google";
import "../globals.css";
import { Provider } from "@/lib/provider";
import BottomNavbar from "@/components/sections/BottomNavbar";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const montserrat = Montserrat_Alternates({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const nunito = Nunito({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Heartly",
  description: "An app to help you connect with people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${nunito.variable} antialiased bg-gradient-to-b from-[#FFA2C933] to-[#FEBF5D33] h-full`}
      >
        <Provider>{children}</Provider>
        {/* <BottomNavbar /> */}
      </body>
    </html>
  );
}
