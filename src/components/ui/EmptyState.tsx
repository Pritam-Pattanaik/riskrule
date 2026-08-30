import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { easeEditorial } from './Motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * V3 EmptyState — Premium empty state with staggered entrance.
 * Icon → Title → Description → CTA animate in sequence.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeEditorial },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`flex flex-col items-center justify-center p-12 text-center card ${className}`}
    >
      <motion.div
        variants={itemVariants}
        className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-6 iris-glow"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className="w-8 h-8 text-iris" />
        </motion.div>
      </motion.div>
      <motion.h3 variants={itemVariants} className="text-xl font-display font-semibold text-primary mb-2">
        {title}
      </motion.h3>
      <motion.p variants={itemVariants} className="text-secondary max-w-md mb-8">
        {description}
      </motion.p>
      {actionLabel && onAction && (
        <motion.div variants={itemVariants}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
