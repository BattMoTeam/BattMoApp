import "@workspace/ui/styles/globals.css"
import NavigationBar from "@workspace/ui/components/navigation-bar";
import { ReactNode } from "react";
import Footer from "@workspace/ui/components/footer"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>

        {/* Page title */}
        <title>BattMoApp</title>

        {/* Favicon */}
        <link rel="icon" href={`${process.env.NODE_ENV === "production" ? "" : ""}/battmo_logo_thumb.png`} />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 

      </head>
      <body >
        <div className="page-shell">

          <header className="page-header">
            <NavigationBar />
          </header>
          
          <main className="page-main">
            {children /* ← segment-specific layouts or pages render here */}
          </main>

          <div className="page-footer">
            <Footer/>
          </div>
          

        </div>
      </body>
    </html>
  );
}
