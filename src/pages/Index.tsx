import React, { useState, useCallback } from "react";
import CircularRing from "@/components/CircularRing";
import MacroCard from "@/components/MacroCard";
import FAB from "@/components/FAB";
import FoodLog from "@/components/FoodLog";
import LogMealSheet from "@/components/LogMealSheet";
import { FoodEntry } from "@/types/food";

const DAILY_GOAL = 2000;

interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Index = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [totals, setTotals] = useState<Totals>({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleLog = useCallback((entry: FoodEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setTotals((prev) => ({
      calories: prev.calories + entry.calories,
      protein: prev.protein + entry.protein,
      carbs: prev.carbs + entry.carbs,
      fat: prev.fat + entry.fat,
    }));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) {
        setTotals((t) => ({
          calories: Math.max(0, t.calories - entry.calories),
          protein: Math.max(0, t.protein - entry.protein),
          carbs: Math.max(0, t.carbs - entry.carbs),
          fat: Math.max(0, t.fat - entry.fat),
        }));
      }
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  return (
    <div
      className="radial-bg flex flex-col items-center w-full h-full overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Scrollable content area */}
      <div className="flex-1 w-full overflow-y-auto px-4 pt-safe-top pb-32" style={{ paddingTop: "env(safe-area-inset-top, 16px)" }}>
        <div className="max-w-sm mx-auto flex flex-col items-center">
          {/* Header */}
          <div className="w-full flex items-center justify-between pt-6 pb-2 px-1">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                Today
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <div
              className="glass-card px-3 py-1.5 flex items-center gap-1.5"
              style={{ borderRadius: "999px" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: totals.calories >= DAILY_GOAL ? "#f87171" : "#4ade80",
                  boxShadow: totals.calories >= DAILY_GOAL ? "0 0 6px #f87171" : "0 0 6px #4ade80",
                }}
              />
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                {totals.calories >= DAILY_GOAL ? "Goal reached" : `${DAILY_GOAL - totals.calories} left`}
              </span>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="mt-4 mb-6">
            <CircularRing current={totals.calories} goal={DAILY_GOAL} size={260} />
          </div>

          {/* Macro Cards */}
          <div className="flex gap-3 w-full mb-2">
            <MacroCard
              label="Protein"
              value={totals.protein}
              dotColor="#60a5fa"
            />
            <MacroCard
              label="Carbs"
              value={totals.carbs}
              dotColor="#fbbf24"
            />
            <MacroCard
              label="Fat"
              value={totals.fat}
              dotColor="#f87171"
            />
          </div>

          {/* Food Log */}
          <FoodLog entries={entries} onDelete={handleDelete} />

          {/* Empty state */}
          {entries.length === 0 && (
            <div className="mt-8 flex flex-col items-center gap-2 opacity-40">
              <p className="text-sm font-medium text-foreground">No meals logged yet</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                Tap the button below to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FAB — fixed at bottom center */}
      <div
        className="fixed bottom-0 left-0 right-0 flex justify-center items-end pb-8 z-30 pointer-events-none"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}
      >
        <div className="pointer-events-auto">
          <FAB onClick={() => setSheetOpen(true)} />
        </div>
      </div>

      {/* Log Meal Sheet */}
      <LogMealSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onLog={handleLog}
      />
    </div>
  );
};

export default Index;
