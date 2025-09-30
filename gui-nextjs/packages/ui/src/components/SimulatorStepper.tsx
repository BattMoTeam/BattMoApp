import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@workspace/ui/components/stepper"

import {
  TargetIcon,
  SettingsIcon,
  Blocks,
  ChartSpline,
  Bike
} from "lucide-react"

const steps = [
  {
    step: 1,
    title: "Simulation type",
    icon: <TargetIcon size={16} />,
  },
  {
    step: 2,
    title: "Simulation configuration",
    icon: <SettingsIcon size={16} />,
  },
  {
    step: 3,
    title: "Cell configuration",
    icon: <Blocks size={16} />,
  },
  {
    step: 4,
    title: "Cycling protocol",
    icon: <Bike size={16} />,
  },
]

export default function SimulatorStepper() {
  return (
    <div className="space-y-8 text-left">
      <Stepper defaultValue={1} orientation="vertical">
        {steps.map(({ step, title, icon }) => (
          <StepperItem
            key={step}
            step={step}
            className="relative items-start not-last:flex-1"
          >
            <StepperTrigger className="items-start rounded pb-12 last:pb-0">
              <StepperIndicator className="flex size-10 items-center justify-center rounded-full border-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=completed]:bg-primary data-[state=completed]:text-white data-[state=completed]:border-primary data-[state=inactive]:bg-white data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-muted">
                {icon}
              </StepperIndicator>
              <div className="mt-0.5 px-2 text-left">
                <StepperTitle className="text-sm font-medium max-w-1">
                  {title}
                </StepperTitle>
              </div>
            </StepperTrigger>

            {/* vertical line through center of icons */}
            {step < steps.length && (
              <StepperSeparator className="absolute top-[calc(2.5rem)] left-5 -order-1 m-0 h-[calc(100%-2.5rem)] w-px bg-muted group-data-[state=completed]/step:bg-primary" />
            )}
          </StepperItem>
        ))}
      </Stepper>

    </div>
  )
}