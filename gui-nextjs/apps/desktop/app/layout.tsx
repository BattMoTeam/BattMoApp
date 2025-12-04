import "@workspace/ui/globals.css"
import NavigationBar from "@workspace/ui/components/navigation-bar";
import { ReactNode } from "react";

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
