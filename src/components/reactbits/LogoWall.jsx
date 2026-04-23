import React from "react";
import "./LogoWall.css";

const LogoWall = ({
  items = [],
  direction = "left",
  pauseOnHover = true,
  size = "clamp(3rem, 1rem + 20vmin, 5rem)",
  duration = "30s",
  textColor = "var(--surface-ink)",
  bgColor = "transparent"
}) => {
  return (
    <div
      className="logo-wall-wrapper"
      style={{
        "--size": size,
        "--duration": duration,
        "--color-text": textColor,
        "--color-bg": bgColor
      }}
    >
      <div 
        className={`logo-wall-marquee ${direction === "left" ? "marquee-left" : "marquee-right"} ${pauseOnHover ? "pause-on-hover" : ""}`}
      >
        <div className="logo-wall-track">
          {items.map((item, idx) => {
            const isObj = typeof item === 'object' && item !== null && !React.isValidElement(item);
            const iconClass = isObj ? item.icon : item;
            const name = isObj ? item.name : undefined;
            return (
              <div className="logo-wall-item" key={`item-1-${idx}`} data-name={name}>
                <i className={iconClass}></i>
              </div>
            );
          })}
          
          {items.map((item, idx) => {
            const isObj = typeof item === 'object' && item !== null && !React.isValidElement(item);
            const iconClass = isObj ? item.icon : item;
            const name = isObj ? item.name : undefined;
            return (
              <div className="logo-wall-item" key={`item-2-${idx}`} data-name={name}>
                <i className={iconClass}></i>
              </div>
            );
          })}
          {items.map((item, idx) => {
            const isObj = typeof item === 'object' && item !== null && !React.isValidElement(item);
            const iconClass = isObj ? item.icon : item;
            const name = isObj ? item.name : undefined;
            return (
              <div className="logo-wall-item" key={`item-3-${idx}`} data-name={name}>
                <i className={iconClass}></i>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LogoWall;
