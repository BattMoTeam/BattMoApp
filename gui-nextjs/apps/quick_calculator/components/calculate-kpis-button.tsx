'use client';

import { Button } from "@workspace/ui/components/ui/button";
import CalculateKPIsUI from "./caclulate-kpis-ui";
import { useState } from "react";

export default function CalculateKPIsButton() {
  const [showUI, setShowUI] = useState(false);

  return (
    <section id="calculate-button" className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="h-12 rounded-xl px-6 text-base font-semibold shadow-md shadow-primary/20"
          variant="default"
          onClick={() => setShowUI((prev) => !prev)}
        >
          {showUI ? "Hide KPI Panel" : "Calculate KPIs"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Opens a live websocket panel and runs calculation when input is loaded.
        </p>
      </div>
      {showUI ? <CalculateKPIsUI /> : null}
    </section>
  );
}
