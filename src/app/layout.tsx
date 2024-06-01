import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";
import { NavbarProvider } from "../contexts/navbarContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PENS Online Classroom",
  description:
    "PENS Online Classroom adalah platform pembelajaran daring yang memungkinkan pengajar dan peserta belajar untuk berinteraksi secara langsung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(poppins.className, "antialiased")}>
        <NavbarProvider>{children}</NavbarProvider>
      </body>
    </html>
  );
}
