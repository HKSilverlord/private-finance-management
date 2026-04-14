'use client';

import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  viewportMargin?: string;
}

const offsets = {
  up:    { y: 60 },
  down:  { y: -60 },
  left:  { x: 60 },
  right: { x: -60 },
  none:  {},
};

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  className,
  viewportMargin = '-100px',
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' as const }}
      viewport={{ once: true, margin: viewportMargin as any }}
    >
      {children}
    </motion.div>
  );
}
