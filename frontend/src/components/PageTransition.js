import React from 'react';
import { motion } from 'framer-motion';

// Defined professional layout animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1], // Smooth custom cubic bezier curves
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.2,
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
