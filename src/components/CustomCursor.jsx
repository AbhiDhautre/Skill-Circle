import React, { useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isHover = useRef(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ring follows with spring lag
  const springX = useSpring(mouseX, { stiffness: 120, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Dot follows instantly via direct DOM
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const addHover = () => {
      isHover.current = true;
      dotRef.current?.classList.add("hover");
      ringRef.current?.classList.add("hover");
    };

    const removeHover = () => {
      isHover.current = false;
      dotRef.current?.classList.remove("hover");
      ringRef.current?.classList.remove("hover");
    };

    document.addEventListener("mousemove", moveCursor, { passive: true });

    // Detect hover over interactive elements
    const interactiveSelector = "a, button, [role='button'], input, textarea, select, label, .holo-card, .bento-card, .step-card, .course-card, .post-card";

    const handleOver = (e) => {
      if (e.target.closest(interactiveSelector)) addHover();
    };
    const handleOut = (e) => {
      if (e.target.closest(interactiveSelector)) removeHover();
    };

    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Inner dot — follows instantly */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      {/* Outer ring — springs behind */}
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
