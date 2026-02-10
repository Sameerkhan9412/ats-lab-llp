import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ATS Laboratories LLP | Proficiency Testing & Reference Materials",
  description:
    "ATS Laboratories LLP is a secure digital platform for laboratories to manage proficiency testing programs, reference materials, online submissions, compliance tracking, and report downloads. Designed for NABL and ISO accredited laboratories.",
    icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <link
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0"
    rel="stylesheet"
  />
      </head>
      <body className="">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
         <Toaster />
      </body>
    </html>
  );
}
