"use client";

import React, { useEffect, useRef } from "react";

interface ArcReactorProps {
  state: "idle" | "listening" | "processing" | "speaking";
}

export const ArcReactor: React.FC<ArcReactorProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Color scheme based on state
      let primaryColor = "rgba(0, 240, 255, ";
      let glowColor = "rgba(0, 240, 255, 0.4)";
      let speed = 0.015;

      if (state === "listening") {
        primaryColor = "rgba(16, 185, 129, "; // Emerald
        glowColor = "rgba(16, 185, 129, 0.6)";
        speed = 0.03;
      } else if (state === "processing") {
        primaryColor = "rgba(245, 158, 11, "; // Amber
        glowColor = "rgba(245, 158, 11, 0.6)";
        speed = 0.05;
      } else if (state === "speaking") {
        primaryColor = "rgba(168, 85, 247, "; // Purple/Neon
        glowColor = "rgba(168, 85, 247, 0.7)";
        speed = 0.04;
      }

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 95, 0, Math.PI * 2);
      ctx.strokeStyle = primaryColor + "0.15)";
      ctx.lineWidth = 12;
      ctx.stroke();

      // Outer segmented ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      const segments = 12;
      for (let i = 0; i < segments; i++) {
        ctx.beginPath();
        const startSeg = (i * Math.PI * 2) / segments;
        const endSeg = startSeg + (Math.PI * 2) / segments - 0.15;
        ctx.arc(0, 0, 85, startSeg, endSeg);
        ctx.strokeStyle = primaryColor + "0.8)";
        ctx.lineWidth = 4;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;
        ctx.stroke();
      }
      ctx.restore();

      // Inner counter-rotating ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 1.5);
      const innerSegs = 8;
      for (let i = 0; i < innerSegs; i++) {
        ctx.beginPath();
        const startSeg = (i * Math.PI * 2) / innerSegs;
        const endSeg = startSeg + (Math.PI * 2) / innerSegs - 0.25;
        ctx.arc(0, 0, 60, startSeg, endSeg);
        ctx.strokeStyle = primaryColor + "0.9)";
        ctx.lineWidth = 6;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;
        ctx.stroke();
      }
      ctx.restore();

      // Core glowing orb
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor + "0.25)";
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 25;
      ctx.fill();

      // Triangle core mark
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.5);
      ctx.beginPath();
      const r = 24;
      for (let i = 0; i < 3; i++) {
        const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = primaryColor + "1)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      angle += speed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        className="drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      />
      <div className="mt-2 text-xs font-mono tracking-widest uppercase font-semibold text-cyan-400/90 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            state === "listening"
              ? "bg-emerald-400 animate-ping"
              : state === "processing"
              ? "bg-amber-400 animate-spin"
              : state === "speaking"
              ? "bg-purple-400 animate-pulse"
              : "bg-cyan-400"
          }`}
        />
        SYSTEM STATE: {state}
      </div>
    </div>
  );
};
