"use client"; // Add this since we're using state
import localFont from "next/font/local";
import "./globals.css";
import { ReactNode, useState } from "react";
import MenuBar from "./components/MenuBar/MenuBar";
import Menu from "./components/Menu/Menu"; // If you're using the Menu component
import { AuthProvider } from "@/context/AuthContext";

// export const metadata = {
//   title: "Stefan Markovic | Codegrid",
//   description: "CGMWT September by Codegrid",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <html lang="en">
      <body>
      <AuthProvider>

        <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        {children}
        </AuthProvider>

      </body>
    </html>
  );
}