"use client";

import { useState } from "react";
import ToggleLabel from "@workspace/ui/components/label-with-toggle";
import GeometryPlot from "@workspace/ui/components/geometry-plot";

interface GeometryPlotToggleProps {
  className?: string;
}

export function GeometryPlotToggle({ className }: GeometryPlotToggleProps) {
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

  const [checked, setChecked] = useState(true);

  return (
    <div className={className}>
      <ToggleLabel
        className=""
        label = "Porosity"
        toggle="descriptive"
        leftLabel="Realistic"
        rightLabel="Scaled"
        checked={checked}
        onCheckedChange={setChecked} // lift state up
      >
        <div className="mt-10">
          <GeometryPlot
            geometryData={geometryData}
            scaled={checked} // dynamically scale
          />
        </div>
      </ToggleLabel>
    </div>
  );
}
