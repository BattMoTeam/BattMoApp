"use client";

import SimulatorStepper from "@workspace/ui/components/SimulatorStepper";
import { ResultsSideBar } from "@workspace/ui/components/ResultsSideBar";
import { SidebarProvider,useSidebar  } from "@workspace/ui/components/sidebar";

function SimulatorContent() {

  const { state } = useSidebar();

  return (

      <div className="flex h-screen w-full">

      {/* Left column: stepper */}
      {state == "collapsed" && (
        <div className="w-[300px] flex-none p-5 bg-background transition-all duration-300">
          <SimulatorStepper />
        </div>
      )}

      {/* Middle column: scrollable content */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-hide p-5 bg-background transition-all duration-300 ${
          state == "expanded" ? "ml-0" : ""
        }`}
      >
        <div className="space-y-6">
          <div className="h-[600px] bg-gray-200 rounded-lg p-5">Content 1</div>
          <div className="h-[600px] bg-gray-300 rounded-lg p-5">Content 2</div>
          <div className="h-[600px] bg-gray-200 rounded-lg p-5">Content 3</div>
          <div className="h-[600px] bg-gray-300 rounded-lg p-5">Content 4</div>
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