import React, { useRef, useEffect } from "react";
import "./Squares.css";

const Squares = ({ direction = "right", speed = 1, borderColor = "#999", squareSize = 40 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let gridOffset = { x: 0, y: 0 };
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const startX = gridOffset.x % squareSize;
      const startY = gridOffset.y % squareSize;

      ctx.beginPath();
      for (let x = startX - squareSize; x < canvas.width + squareSize; x += squareSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = startY - squareSize; y < canvas.height + squareSize; y += squareSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    };

    const animate = () => {
      const step = speed * 0.5;
      if (direction === "right") gridOffset.x += step;
      else if (direction === "left") gridOffset.x -= step;
      else if (direction === "up") gridOffset.y -= step;
      else if (direction === "down") gridOffset.y += step;
      else if (direction === "diagonal") {
        gridOffset.x += step;
        gridOffset.y += step;
      }

      drawGrid();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, borderColor, squareSize]);

  return (
    <div className="reactbits-squares-container">
      <canvas ref={canvasRef} className="reactbits-squares-canvas" />
      <div className="squares-fog"></div>
    </div>
  );
};

export default Squares;
