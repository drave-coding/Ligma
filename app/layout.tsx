import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});



export const metadata: Metadata = {
  title: "Ligma",
  description: "Figma Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
