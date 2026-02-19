import React from "react";
import { Utensils, X } from "lucide-react";
import { FoodEntry } from "@/types/food";

interface FoodLogProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

const FoodLog: React.FC<FoodLogProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) return null;

  return (
    <div className="w-full mt-4">
      <p className="text-xs font-semibold tracking-widest uppercase mb-3 px-1" style={{ color: "rgba(255,255,255,0.35)" }}>
        Today's Log
      </p>
      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <div key={entry.id} className="glass-card flex items-center px-4 py-3 gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(247,77,185,0.15)" }}
            >
              <Utensils size={16} style={{ color: "#f74db9" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{entry.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {entry.grams}g · {entry.protein}p · {entry.carbs}c · {entry.fat}f
              </p>
            </div>
            <div className="text-right flex-shrink-0 mr-2">
              <p className="text-sm font-bold" style={{ color: "#f74db9" }}>
                {entry.calories}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>kcal</p>
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: "rgba(255,255,255,0.07)" }}
              aria-label="Remove entry"
            >
              <X size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodLog;
