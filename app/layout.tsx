import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ['400','600','700'],
});



export const metadata: Metadata = {
  title: "Ligma",
  description: "Figma Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} bg-primary-grey-200`}
      >
        <Room>

        {children}
        </Room>
      </body>
    </html>
  );
}
