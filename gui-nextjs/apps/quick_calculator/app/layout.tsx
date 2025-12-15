import TitleBar from "@/components/title-bar";
import "@workspace/ui/styles/globals.css"
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
          <head>
    
            {/* Page title */}
            <title>BattMo Quick Calculator</title>
    
            {/* Favicon */}
            <link rel="icon" href={`${process.env.NODE_ENV === "production" ? "" : ""}/battmo_logo_thumb.png`} />
    
            {/* Viewport */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
    
          </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
