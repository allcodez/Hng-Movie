// src/components/transition/withTransition.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import "./transition.css";

export function withTransition<P extends object>(Component: React.ComponentType<P>) {
  return function TransitionWrapper(props: P) {
    const pathname = usePathname();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Component {...props} />
          <motion.div
            className="slide-in"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
          />
          <motion.div
            className="slide-out"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
          />
        </motion.div>
      </AnimatePresence>
    );
  };
}