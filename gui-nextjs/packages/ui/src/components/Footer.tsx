import React from "react";
import { Button } from "@workspace/ui/components/button";
import { SiGithub, SiYoutube, SiLinkedin } from "react-icons/si";
import { BookOpen } from "lucide-react";

const Footer = () => (
  <footer className="bg-footer-primary text-footer-foreground py-8">
    <div className="max-w-[1400px] mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Branding */}
        <div className="flex flex-col gap-4 items-start">
          <h2 className="text-2xl font-bold">Learn more...</h2>
          <p className="text-sm text-footer-foreground/70">
            ... about accelerating battery innovation through digital tools.
          </p>
        </div>

        {/* Funding */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Funding</h3>
            <p className="text-sm text-footer-foreground/80">
              This project has received funding from the European Union.
            </p>
          </div>
        </div>

      </div>

      {/* Social Badges */}
      <div className="flex flex-wrap gap-2 mt-6 items-center">
        <Button variant="ghost" size="sm" asChild>
          <a href="https://github.com/BattMoTeam/BattMoApp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <SiGithub size={20} /> GitHub
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://www.youtube.com/@battmo5613" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <SiYoutube size={20} /> YouTube
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://www.linkedin.com/company/battmo/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <SiLinkedin size={20} /> Linkedin
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="https://battmoteam.github.io/BattMo.jl/dev/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <BookOpen className="size-4" /> Documentation
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
