import type {Metadata} from "next";
import {Bricolage_Grotesque} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const bricolage = Bricolage_Grotesque({
    variable: "--font-bricolage",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Paris Indoor Soccer",
    description: "Real-time AI Teaching Platform",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${bricolage.variable} antialiased bg-gray-300 mb-10`}>
        <Navbar/>
        {children}
        </body>
        </html>
    );
}
