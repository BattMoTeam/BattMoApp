
// app/simulator/_components/scroll-sections.tsx (CLIENT)
'use client';

import { MutableRefObject, useEffect, useMemo } from 'react';
import { useStep } from '../_state/step-context';

type Props = {
  scrollContainerRef: MutableRefObject<HTMLDivElement | null>;
};

const SECTIONS = [
  { id: 'block-1', step: 1, bg: 'bg-gray-200' },
  { id: 'block-2', step: 2, bg: 'bg-gray-300' },
  { id: 'block-3', step: 3, bg: 'bg-gray-200' },
  { id: 'block-4', step: 4, bg: 'bg-gray-300' },
];

export default function ScrollSections({ scrollContainerRef }: Props) {
  const { setActiveStep, setScrollToStep } = useStep();

  // Provide a programmatic scroll function that uses the **correct container**
  useEffect(() => {
    const fn = (step: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const target = container.querySelector<HTMLElement>(`#block-${step}`);
      if (!target) return;
      // Smoothly align the section to the top within the inner scroll container
      target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    };
    setScrollToStep?.(fn);
    return () => setScrollToStep?.(() => undefined as any);
  }, [setScrollToStep, scrollContainerRef]);

  // Observe visibility changes using the **container as the root**
  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          const s = SECTIONS.find((sec) => sec.id === visible.target.id);
          if (s) setActiveStep(s.step);
        }
      },
      {
        root,
        threshold: [0.25, 0.5, 0.75],
        // If your sticky metrics overlay overlaps the top,
        // you can nudge the root margin to avoid mis-detection:
        // rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--metrics-height') || '56')}px 0px 0px 0px`,
      }
    );

    SECTIONS.forEach(({ id }) => {
      const el = root.querySelector<HTMLElement>(`#${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveStep, scrollContainerRef]);

  // Sections: add scroll margin to account for sticky metrics overlay
  const sectionEls = useMemo(
    () =>
      SECTIONS.map(({ id, bg }, i) => (
        <section
          key={id}
          id={id}
          className={`
            ${bg} rounded-lg p-5 h-[600px]
            scroll-mt-[calc(var(--metrics-height,56px)+16px)]
          `}
        >
          Content {i + 1}
        </section>
      )),
    []
  );

  return <div className="space-y-6">{sectionEls}</div>;
}