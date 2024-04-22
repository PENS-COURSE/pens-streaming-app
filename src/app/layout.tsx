import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Konsep Pemrograman | PENS Online Streaming",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(poppins.className, "antialiased")}>{children}</body>
    </html>
  );
}
