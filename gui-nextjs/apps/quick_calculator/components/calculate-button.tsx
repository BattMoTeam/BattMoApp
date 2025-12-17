'use client';

import { Button } from "@workspace/ui/components/ui/button";

type CalculateButtonProps = {
    onClick?: () => void
    disabled?: boolean
}

export default function CalculateButton() {
  
  return (
    <header
      id="calculate-button"
      className=""
    >
      <div>
        <Button 
            className="text-2xl pb-3"
            variant={"default"}>
            Calculate KPIs
        </Button>

      </div>
    </header>
  );
}