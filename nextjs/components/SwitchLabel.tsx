import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface SwitchLabelProps {
  label?: string;
  sublabel?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function SwitchLabel({ label = "", sublabel = "", description = "", children }: SwitchLabelProps) {
  const id = useId()
  return (
    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <Switch
        id={id}
        className="order-1 h-7 w-20 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
        aria-describedby={`${id}-description`}
      />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>
          {label}{" "}
          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
            {sublabel}
          </span>
        </Label>
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}
