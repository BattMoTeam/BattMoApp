
// app/simulator/_components/StepperPane.tsx (CLIENT)
'use client';

import SimulatorStepper from '@workspace/ui/components/stepper-simulator';
import { useSidebar } from '@workspace/ui/components/ui/sidebar';
import { useStep } from '../_state/step-context';

export default function StepperPane() {
  const { state } = useSidebar(); // "expanded" | "collapsed" (assuming)
  const { activeStep, setActiveStep, scrollToStep } = useStep();

  // When sidebar is open, hide the stepper entirely.
  if (state === 'expanded') return null;

  const onValueChange = (next: number) => {
    setActiveStep(next);
    scrollToStep?.(next);
  };

  return (
    <aside className="w-[20vw] flex-none bg-background relative 
        max-h-[calc(100vh-var(--app-nav-height))] overflow-auto
        place-items-left min-w-0
        ">
      <SimulatorStepper value={activeStep} onValueChange={onValueChange} />
    </aside>
  );
}
