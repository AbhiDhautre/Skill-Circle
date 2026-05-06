import React from "react";
import "../styles/immersive.css";

export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="aurora-layer" />
      <div className="aurora-layer-2" />
      <div className="aurora-grid" />
      <div className="aurora-beam" />
      <div className="aurora-beam-2" />
      <div className="aurora-noise" />
    </div>
  );
}
