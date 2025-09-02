import "./globals.css";
import NavigationBar from "../components/NavigationBar";
import { ReactNode } from "react";

export const metadata = {
  title: "My Next.js Site",
  description: "A simple Next.js site with navigation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}