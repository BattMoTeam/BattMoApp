'use client';

import { Button } from "@workspace/ui/components/ui/button";
import { useBattMoWebSocket } from "@workspace/ui/hooks/useBattMoWebSocket";
import CalculateKPIsUI from "./caclulate-kpis-ui";
import { useState } from "react";

export default function CalculateKPIsButton() {
  
  const [showUI, setShowUI] = useState(false)

  return (
    <header
      id="calculate-button"
      className=""
    >
      <div>
        <Button 
            className="text-2xl pb-3"
            variant={"default"}
            onClick={() => setShowUI(true)}>
            Calculate KPIs
        </Button>

      </div>
      {showUI && <CalculateKPIsUI />}
    </header>
  );
}