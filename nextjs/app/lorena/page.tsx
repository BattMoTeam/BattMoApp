"use client";

import GeometryPlot from "@/components/GeometryPlot";
import ToggleLabel from "@/components/ToggleLabel";
import { Toggle } from "@/components/Toggle";
import { Switch } from "@workspace/ui/components/switch";
import { GeometryPlotToggle } from "@/components/GeometryPlotToggle";

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

export default function LorenaPage() {
  return (
    <div className="space-y-6">
      <h1 className="mt-10 text-2xl font-bold">Switch</h1>
      <h1 className="text-1xl">- from Origin UI</h1>
      <Switch className="mt-3" />

      <h1 className="mt-10 text-2xl font-bold">Toggle</h1>
      <h1 className="text-1xl">- adapted Switch from Origin UI</h1>
      <h1 className="text-1xl">- Toggle with type = "standard" gives the standard switch.</h1>
      <Toggle className="mt-3" type="standard" />
      <h1 className="text-1xl">- Toggle with type = "descriptive" allows for a toggle with text.</h1>
      <Toggle className="mt-3" type="descriptive" leftLabel="Realistic" rightLabel="Scaled" />

      <h1 className="mt-10 text-2xl font-bold">GeometryPlot</h1>
      <h1 className="text-1xl">- Created using react-plotly</h1>
      <h1 className="text-1xl">- Prop scaled = true gives the scaled plot.</h1>
      <GeometryPlot className="mt-3" scaled={true} geometryData={geometryData} />
      <h1 className="text-1xl">- Prop scaled = false gives the full size plot.</h1>
      <GeometryPlot className="mt-3" scaled={false} geometryData={geometryData} />

      <h1 className="mt-10 text-2xl font-bold">ToggleLabel</h1>
      <h1 className="text-1xl">- Altered Origin UI component</h1>
      <ToggleLabel
        toggle="standard"
        label="Label"
        sublabel="Sublabel"
        description="Some content"
        checked={false}
        onCheckedChange={() => {}}
      />

      <h1 className="mt-10 text-2xl font-bold">GeometryPlotToggle</h1>
      <h1 className="text-1xl">- ToggleLabel with descriptive toggle and GeometryPlots as content.</h1>
      <div className="flex-1 p-6">
        <GeometryPlotToggle />
      </div>
    </div>
  );
}
