import SwitchLabel from "./SwitchLabel";
import GeometryPlot from "./GeometryPlot";

interface GeometryPlotSwitchProps {
    onSwitch?: (scaled: boolean) => void;
}


export function GeometryPlotToggle({onSwitch}: GeometryPlotSwitchProps) {
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
    <div>
      <SwitchLabel children = {<GeometryPlot geometryData={geometryData} scaled = {onSwitch}/>} />
    </div>
  )
}