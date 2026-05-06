import React from "react";
import "./CinematicBackground.css";

export default function CinematicBackground() {
  return (
    <div className="cinematic-bg" aria-hidden="true">
      <div className="cinematic-bg__base" />
      <div className="cinematic-bg__orb-1" />
      <div className="cinematic-bg__orb-2" />
      <div className="cinematic-bg__orb-3" />
      <div className="cinematic-bg__orb-4" />
      <div className="cinematic-bg__grid" />
      <div className="cinematic-bg__noise" />
    </div>
  );
}
