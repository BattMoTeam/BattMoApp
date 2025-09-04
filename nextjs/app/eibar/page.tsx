import { Smile } from "lucide-react";
import SimulatorStepper from "@/components/SimulatorStepper";
import Component from "@/components/comp-150"

export default function LibraryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Component playground Eibar</h1>
      <p className="mt-4">We are awesome people doing awesome components <Smile /></p>
      <SimulatorStepper />
      <Component />
    </div>
  );
}