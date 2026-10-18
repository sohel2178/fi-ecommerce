'use client';

import { LazyMotion, MotionConfig, domMax, type Transition } from 'framer-motion';
import type { ReactNode } from 'react';

/** Shared motion vocabulary. Motion answers user actions; the parts cabinet is the only load sequence. */
export const ease = [0.2, 0.8, 0.2, 1] as const;
export const spring: Transition = { type: 'spring', stiffness: 420, damping: 34 };
export const quick: Transition = { duration: 0.2, ease };
export const settle: Transition = { duration: 0.26, ease };

/** Height-auto reveal for alerts, expanding fields and forms. */
export const reveal = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', transition: settle },
  exit: { opacity: 0, height: 0, transition: quick },
};

/**
 * LazyMotion keeps framer-motion's bundle small (use `m.*`, not `motion.*`); domMax is needed for
 * layout / layoutId animations. reducedMotion="user" drops transforms when the OS asks for less motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user" transition={settle}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
