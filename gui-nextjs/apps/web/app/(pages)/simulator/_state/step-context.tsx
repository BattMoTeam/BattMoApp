
// app/simulator/_state/step-context.tsx (CLIENT)
'use client';
import React, { createContext, useContext, useState } from 'react';

type StepContextType = {
  activeStep: number;
  setActiveStep: (n: number) => void;
  scrollToStep?: (n: number) => void; // injected by ScrollSections
  setScrollToStep?: (fn: (n: number) => void) => void;
};

const StepContext = createContext<StepContextType | null>(null);

export function StepProvider({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState(1);
  const [scrollToStep, setScrollToStep] = useState<((n: number) => void) | undefined>(undefined);

  return (
    <StepContext.Provider value={{ activeStep, setActiveStep, scrollToStep, setScrollToStep }}>
      {children}
    </StepContext.Provider>
  );
}

export function useStep() {
  const ctx = useContext(StepContext);
  if (!ctx) throw new Error('useStep must be used within StepProvider');
  return ctx;
}
