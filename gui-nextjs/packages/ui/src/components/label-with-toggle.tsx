"use client";
import { useId } from "react";
import { Toggle } from "@workspace/ui/components/toggle";
import { Label } from "@workspace/ui/components/ui/label";

interface ToggleLabelProps {
  label?: string;
  sublabel?: string;
  description?: string;
  toggle?: "standard" | "descriptive";
  leftLabel?: string;
  rightLabel?: string;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export default function ToggleLabel({
  label,
  sublabel,
  description,
  toggle,
  leftLabel,
  rightLabel,
  checked,
  onCheckedChange,
  children,
  className,
}: ToggleLabelProps) {
  const id = useId();

  const borderClass =
    toggle === "descriptive"
      ? checked
        ? "border-0"
        : "border-0"
      : checked
      ? "border-2"
      : "border";

  return (
    <div className={className}>
      <div
        className={`relative flex w-full flex-col gap-2 rounded-md p-4 bg-secondary outline-none border ${
          borderClass
        }`}
      >
        {/* Top row: label on left, toggle on right */}
        <div className="flex justify-between items-start w-full">
          <div>
            <Label htmlFor={id}>
              {label}{" "}
              <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                {sublabel}
              </span>
            </Label>
          </div>
          <Toggle
            id={id}
            type={toggle}
            leftLabel={leftLabel}
            rightLabel={rightLabel}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className="peer" // make it a peer for sibling styling if needed
          />
        </div>

        {/* Description */}
        {description && (
          <p id={`${id}-description`} className="text-muted-foreground text-xs">
            {description}
          </p>
        )}

        {/* Children */}
        {children}
      </div>
    </div>
  );
}
