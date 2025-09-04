import GeometryPlot from "@/components/GeometryPlot";
import { Toggle } from "@/components/Toggle";
import { Switch } from "@/components/ui/switch";

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
    <div>
      <h1 className="mt-10 text-2xl font-bold">Switch</h1>
      <h1 className="mt-2 text-1xl">- from Origin UI</h1>
      <Switch className="mt-3"/>

      <h1 className="mt-10 text-2xl font-bold">Toggle</h1>
      <h1 className="mt-2 text-1xl">- adapted Switch from Origin UI</h1>
      <h1 className="mt-2 text-1xl">- Toggle with type = "standard" gives the standard switch.</h1>
      <Toggle className = "mt-3" type = "standard"/>
      <h1 className="mt-2 text-1xl">- Toggle with type = "descriptive" allows for a toggle with text.</h1>
      <Toggle className = "mt-3" type = "descriptive" leftLabel="Realistic" rightLabel="Scaled"/>

      <h1 className="mt-10 text-2xl font-bold">GeometryPlot</h1>
      <h1 className="mt-2 text-1xl">- Created using react plotly</h1>
      <h1 className="mt-2 text-1xl">- Prop scaled = true gives the scaled plot.</h1>
      <GeometryPlot className = "mt-3" scaled = {true} geometryData={geometryData}/>
      <h1 className="mt-2 text-1xl">- Prop scaled = false gives the full size plot.</h1>
      <GeometryPlot className = "mt-3" scaled = {false} geometryData={geometryData}/>

      <h1 className="mt-10 text-2xl font-bold">GeometryPlotToggle</h1>
      <h1 className="mt-2 text-1xl">- Created using react plotly</h1>
      <h1 className="mt-2 text-1xl">- Prop scaled = true gives the scaled plot.</h1>
      <GeometryPlot className = "mt-3" scaled = {true} geometryData={geometryData}/>
      <h1 className="mt-2 text-1xl">- Prop scaled = false gives the full size plot.</h1>
      <GeometryPlot className = "mt-3" scaled = {false} geometryData={geometryData}/>

    </div>
  );
}