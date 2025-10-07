"use client";

import { useRef, useState, useEffect } from "react";
import SimulatorStepper from "@workspace/ui/components/SimulatorStepper";
import { ResultsSideBar } from "@workspace/ui/components/ResultsSideBar";
import { SidebarProvider, useSidebar } from "@workspace/ui/components/sidebar";

function SimulatorContent() {
  const { state } = useSidebar();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  const sections = [
    { id: "block-1", step: 1 },
    { id: "block-2", step: 2 },
    { id: "block-3", step: 3 },
    { id: "block-4", step: 4 },
  ];

  // Scroll to section when stepper changes
  const handleStepChange = (step: number) => {
    const container = scrollRef.current;
    const target = document.getElementById(`block-${step}`);
    const navbar = document.querySelector("NavigationBar"); 
    const navHeight = navbar ? navbar.clientHeight : 80;
    if (container && target) {
      container.scrollTo({
        top: target.offsetTop - navHeight - 100,
        behavior: "smooth",
      });
    }
    setActiveStep(step);
  };

  // Update active step while scrolling
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      let current = 1;

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop - 250 <= scrollTop) {
          current = sections[i].step;
        }
      }

      setActiveStep(current);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="flex h-screen w-full">
      {/* Left column: stepper */}
      {state === "collapsed" && (
        <div className="w-[300px] flex-none p-20 bg-background transition-all duration-300 mt-40">
          <SimulatorStepper
            value={activeStep}
            onValueChange={handleStepChange}
          />
        </div>
      )}

      {/* Middle column: scrollable content */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto scrollbar-hide h-[calc(96vh-4rem)] p-5 bg-background transition-all duration-300 ${
          state === "expanded" ? "ml-0" : ""
        }`}
      >
        <div className="space-y-6">
          <div
            id="block-1"
            className="h-[600px] bg-gray-200 rounded-lg p-5 scroll-mt-24"
          >
            Content 1
          </div>
          <div
            id="block-2"
            className="h-[600px] bg-gray-300 rounded-lg p-5 scroll-mt-24"
          >
            Content 2
          </div>
          <div
            id="block-3"
            className="h-[600px] bg-gray-200 rounded-lg p-5 scroll-mt-24"
          >
            Content 3
          </div>
          <div
            id="block-4"
            className="h-[600px] bg-gray-300 rounded-lg p-5 scroll-mt-24"
          >
            Content 4
          </div>
        </div>
      </div>

      {/* Right column: floating sidebar */}
      <ResultsSideBar />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <SidebarProvider defaultOpen={false}>
      <SimulatorContent />
    </SidebarProvider>
  );
}
