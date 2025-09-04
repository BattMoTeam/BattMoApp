"use client"
import { useId, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Switch} from "@/components/ui/switch";
import { Label } from "@/components/ui/label"

interface ToggleProps {
    className?: string;
  type?: "standard" | "descriptive";
  leftLabel?: string; // text when unchecked
  rightLabel?: string; // text when checked
}

export function Toggle({className, type = "standard", leftLabel = "Off", rightLabel = "On" }: ToggleProps) {
  const id = useId()
  const [checked, setChecked] = useState<boolean>(true);
  
  if (type === "descriptive") {
    return (
      <div className= {className}>
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={setChecked}
          className="peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-2.5 me-2.5 flex min-w-15 items-center justify-center text-center">
          {leftLabel}
        </span>
        <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
          {rightLabel}
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        Labeled switch
      </Label>
    </div>
    );
  }

  // Standard switch
  return (
  <div className= {className}>
  <Switch />
  </div>)
  ;
}