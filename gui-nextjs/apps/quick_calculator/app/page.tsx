import CalculateKPIsButton from "@/components/calculate-kpis-button";
import FileUploader from "@workspace/ui/components/file-uploader";


export default function HomePage() {
  return (

      <div className="flex flex-col items-center gap-10 h-screen">
        <h1 className="text-5xl font-bold text-primary h-30 mt-20">Battery KPI Calculator</h1>
        <div className="container">
          <FileUploader/>

        </div>
        <div className="">
          <CalculateKPIsButton/> 
        </div>

        <div className="container">
          Results 
        </div>
      </div>
    
  );
}
