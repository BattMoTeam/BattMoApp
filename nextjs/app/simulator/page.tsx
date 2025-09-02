"use client";

import { useState } from "react";
import GeometryPlot from "@/components/GeometryPlot";
import SimulatorStepper from "@/components/SimulatorStepper";
import TypeSelector from "@/components/TypeSelector";


export default function SimulatorPage() {
  const geometryData = {
    thickness_ne: 50,   
    thickness_pe: 60,   
    thickness_sep: 25,  
    length: 0.1,        
    width: 0.05,        
    porosity_ne: 0.35,  
    porosity_pe: 0.3,   
    porosity_sep: 0.4,  
  };

  return (
    <div className="flex h-screen gap-6 p-5 box-border">
      {/* Left column: Fixed Stepper */}
      <div className="w-[300px] fixed top-1/4 left-20">
        <SimulatorStepper />
      </div>

      {/* Right column: Scrollable content */}
      <div className="flex-1 flex flex-col gap-5 ml-[270px] overflow-y-auto h-screen">
        {/* Simulation Setup Form */}
        <div className="bg-background p-5 rounded-lg">
          <h2 className="mb-4">⚡ Simulation Setup</h2>
          <div>
            <label>Simulation Type</label>
            <TypeSelector />
          </div>
          {/* More form inputs */}
        </div>

        {/* Geometry Plot */}
        <div className="flex-1 p-6">
          <GeometryPlot geometryData={geometryData} />
        </div>
      </div>
    </div>
  );
}