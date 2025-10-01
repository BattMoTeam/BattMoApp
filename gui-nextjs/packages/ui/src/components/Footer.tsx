import React from "react";
import { Button } from "@workspace/ui/components/button";
import { SiGithub, SiYoutube, SiLinkedin } from 'react-simple-icons';
import { BookOpen } from 'lucide-react';

const Footer = () => (
  <footer className="bg-footer-primary text-footer-foreground py-16">
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Branding */}
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-2xl font-bold">Learn more</h2>
          <p className="text-sm text-footer-foreground/70">
            Accelerating battery innovations.
          </p>
          {/* Shadcn-style badges */}
          
        </div>

        {/* Funding + Social Badges */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Funding</h3>
            <p className="text-sm text-footer-foreground/80">
              This project has received funding from the European Union.
            </p>
          </div>

          
        </div>
        

      </div>
      <div className="flex flex-wrap gap-1 mt-4 items-center">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <SiGithub className="size-4 mr-2" /> SiGithub
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <SiYoutube className="size-4 mr-2" /> SiYoutube
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <BookOpen className="size-4 mr-2" /> Documentation
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <SiLinkedin className="size-4 mr-2" /> SiLinkedin
              </a>
            </Button>
          </div>

      {/* Optional bottom divider */}
      <div className="border-t border-footer-foreground/20 mt-12 pt-6 text-center text-sm text-footer-foreground/60">
        Built with ❤️ by the BattMo team.
        <p className="text-xs text-footer-foreground/50 mt-2">
            &copy; {new Date().getFullYear()} BattMo. All rights reserved.
          </p>
      </div>
      
    </div>
  </footer>
);

export default Footer;
