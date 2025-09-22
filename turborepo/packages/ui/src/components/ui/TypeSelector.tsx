import { useState } from "react";
import CardButton from "@ui/components/ui/CardButton";
import { ArrowRight, Undo2 } from "lucide-react";

export default function TypeSelector() {
  const [selected, setSelected] = useState("simulate");

  return (
    <div className="flex gap-10">
      <CardButton
        icon={<ArrowRight className="size-18" />}
        title="Simulate performance"
        subtitle="Define parameters to see how the battery behaves"
        selected={selected === "simulate"}
        onClick={() => setSelected("simulate")}
      />

      <CardButton
        icon={<Undo2 className="size-18" />}
        title="Optimize parameters"
        subtitle="Find the best parameter values that meet a desired performance or target behavior"
        selected={selected === "optimize"}
        onClick={() => setSelected("optimize")}
      />
    </div>
  );
}