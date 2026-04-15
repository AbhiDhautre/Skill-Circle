import React, { useState, useEffect } from "react";
import "./RotatingText.css";

export default function RotatingText({
  phrases = ["Hello", "World"],
  interval = 3000,
  className = "",
  highlightClass = "highlight",
}) {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
  
      setIsFading(true);

    
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsFading(false);
      }, 500); 
    }, interval);

    return () => clearInterval(timer);
  }, [phrases.length, interval]);

  return (
    <span className={`rotating-text-wrapper ${className}`}>
      <span
        className={`rotating-text ${highlightClass} ${
          isFading ? "fade-out" : "fade-in"
        }`}
      >
        {phrases[index]}
      </span>
    </span>
  );
}
