import React, { useEffect, useRef, useState } from "react";

interface MacroCardProps {
  label: string;
  value: number;
  unit?: string;
  dotColor: string;
  flash?: boolean;
}

const MacroCard: React.FC<MacroCardProps> = ({ label, value, unit = "g", dotColor, flash }) => {
  const displayRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(value);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 800);

    const duration = 800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(start + (end - start) * eased);
      if (displayRef.current) displayRef.current.textContent = String(val);
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <div
      className={`glass-card flex flex-col items-center justify-center py-4 px-3 flex-1 transition-all duration-300 ${
        isFlashing ? "flash-update" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
        />
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span ref={displayRef} className="text-2xl font-bold text-foreground">
          {value}
        </span>
        <span className="text-xs font-medium ml-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          {unit}
        </span>
      </div>
    </div>
  );
};

export default MacroCard;
