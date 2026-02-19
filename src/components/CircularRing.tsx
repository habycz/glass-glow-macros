import React, { useEffect, useRef } from "react";

interface CircularRingProps {
  current: number;
  goal: number;
  size?: number;
}

const CircularRing: React.FC<CircularRingProps> = ({ current, goal, size = 260 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const dashoffset = circumference * (1 - progress);

  const displayRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(current);

  // Animated count-up
  useEffect(() => {
    const start = prevRef.current;
    const end = current;
    if (start === end) return;
    const duration = 1000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (end - start) * eased);
      if (displayRef.current) {
        displayRef.current.textContent = value.toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    requestAnimationFrame(tick);
  }, [current]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Track ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#f74db9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          className="progress-ring-circle ring-glow"
        />
      </svg>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center z-10">
        <span
          ref={displayRef}
          className="font-black text-foreground leading-none"
          style={{ fontSize: "3.5rem", letterSpacing: "-0.03em" }}
        >
          {current.toLocaleString()}
        </span>
        <span className="text-sm font-medium mt-1" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
          KCAL
        </span>
        <span className="text-xs mt-2 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
          of {goal.toLocaleString()} goal
        </span>
      </div>
    </div>
  );
};

export default CircularRing;
