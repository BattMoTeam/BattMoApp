"use client";

import { useState } from "react";
import SimulatorStepper from "@repo/ui/components/SimulatorStepper";
import TypeSelector from "@repo/ui/components/TypeSelector";
import { GeometryPlotToggle } from "@repo/ui/components/GeometryPlotToggle";
import WebSocketClient from "@repo/ui/components/WebSocketClient";


export default function SimulatorPage() {

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
          <GeometryPlotToggle />
        </div>
        {/* Geometry Plot */}
        <div className="flex-1 p-6">
          <WebSocketClient />
        </div>
      </div>
    </div>
  );
}