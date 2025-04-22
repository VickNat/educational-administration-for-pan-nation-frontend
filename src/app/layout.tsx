import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "./context/RoleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Class Bridge - Educational Administration System",
  description: "A comprehensive educational administration system for managing classes, teachers, and students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}
