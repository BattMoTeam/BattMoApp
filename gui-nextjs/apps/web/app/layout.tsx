import "@workspace/ui/globals.css"
import NavigationBar from "@workspace/ui/components/NavigationBar";
import { ReactNode } from "react";
import Footer from "@workspace/ui/components/Footer"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body >
        <div className="flex flex-col min-h-screen">
          <NavigationBar />
        <main className="p-6">{children}</main>

        </div>
        

        <Footer/>
      </body>
    </html>
  );
}
