import type { Metadata } from "next";
import { Playfair_Display, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dhruv Gupta | Full-Stack Software Engineer & Co-Founder of Zappit",
  description: "Engineering portfolio of Dhruv Gupta — Co-founder of Zappit, creator of RGPV Resources, B.Tech CSE student at ITM Gwalior.",
  keywords: ["Dhruv Gupta", "Zappit", "Full-Stack Engineer", "SDE Candidate", "React", "Firebase", "Engineering Portfolio"],
  authors: [{ name: "Dhruv Gupta" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F9F8F6] text-[#18181B] font-sans antialiased selection:bg-[#E4E1DA] selection:text-[#18181B] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
