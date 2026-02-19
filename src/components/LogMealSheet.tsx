import React, { useState, useRef, useCallback } from "react";
import { Camera, ChevronLeft, X, Check, Upload, AlertCircle } from "lucide-react";
import { calculateMacros, MOCK_FOOD_NAME, FoodEntry } from "@/types/food";
import { analyzeNutritionLabel, getApiKey } from "@/services/gemini";

type Step = "scan" | "scanning" | "grams" | "summary" | "logging";

interface LogMealSheetProps {
  open: boolean;
  onClose: () => void;
  onLog: (entry: FoodEntry) => void;
  onOpenSettings: () => void;
}

const LogMealSheet: React.FC<LogMealSheetProps> = ({ open, onClose, onLog, onOpenSettings }) => {
  const [step, setStep] = useState<Step>("scan");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [grams, setGrams] = useState("");
  const [closing, setClosing] = useState(false);
  const [scannedMacros, setScannedMacros] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gramsNum = parseFloat(grams) || 0;
  const macros = scannedMacros
    ? {
        calories: Math.round((scannedMacros.calories * gramsNum) / 100),
        protein: Math.round((scannedMacros.protein * gramsNum) / 100),
        carbs: Math.round((scannedMacros.carbs * gramsNum) / 100),
        fat: Math.round((scannedMacros.fat * gramsNum) / 100),
      }
    : calculateMacros(gramsNum);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setStep("scan");
      setImagePreview(null);
      setGrams("");
      setScannedMacros(null);
      setError(null);
      onClose();
    }, 300);
  }, [onClose]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setError("API key not found. Please add your Gemini API key in settings.");
      setTimeout(() => {
        handleClose();
        onOpenSettings();
      }, 2000);
      return;
    }

    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setError(null);
    setStep("scanning");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;
          const nutritionData = await analyzeNutritionLabel(base64Image, apiKey);
          setScannedMacros(nutritionData);
          setStep("grams");
        } catch (err) {
          console.error("Error analyzing image:", err);
          setError(err instanceof Error ? err.message : "Failed to analyze image");
          setStep("scan");
          setImagePreview(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error reading file:", err);
      setError("Failed to read image file");
      setStep("scan");
      setImagePreview(null);
    }
  };

  const handleLog = () => {
    setStep("logging");
    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: scannedMacros ? "Scanned Food" : MOCK_FOOD_NAME,
      grams: gramsNum,
      ...macros,
    };
    setTimeout(() => {
      onLog(entry);
      handleClose();
    }, 800);
  };

  const handleUseDemoData = () => {
    setScannedMacros(null);
    setStep("grams");
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 glass-card-dark rounded-t-3xl ${
          closing ? "animate-slide-down" : "animate-slide-up"
        }`}
        style={{ maxHeight: "82vh", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <button
            onClick={step !== "scan" && step !== "logging" ? () => setStep(step === "summary" ? "grams" : "scan") : handleClose}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {step === "scan" ? <X size={16} /> : <ChevronLeft size={16} />}
          </button>
          <div className="flex gap-1.5">
            {(["scan", "grams", "summary"] as Array<"scan" | "grams" | "summary">).map((s) => {
              const isActive = step === s || (step === "scanning" && s === "scan");
              return (
                <div
                  key={s}
                  className="h-1 rounded-full transition-all duration-400"
                  style={{
                    width: isActive ? 20 : 6,
                    background: isActive ? "#f74db9" : "rgba(255,255,255,0.2)",
                  }}
                />
              );
            })}
          </div>
          <div className="w-9" />
        </div>

        <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: "calc(82vh - 80px)" }}>
          {/* Error Message */}
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-2xl flex items-center gap-2 animate-fade-in-up"
              style={{ background: "rgba(248, 113, 113, 0.15)", border: "1px solid rgba(248, 113, 113, 0.3)" }}
            >
              <AlertCircle size={16} style={{ color: "#f87171" }} />
              <p className="text-sm font-medium" style={{ color: "#f87171" }}>
                {error}
              </p>
            </div>
          )}

          {/* ── STEP 1: SCAN ── */}
          {step === "scan" && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-bold text-foreground mb-1">Scan Nutrition Label</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                Take a photo of the nutrition facts
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageSelect}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-4 rounded-3xl py-12 transition-all duration-200 active:scale-98"
                style={{
                  border: "1.5px dashed rgba(247,77,185,0.4)",
                  background: "rgba(247,77,185,0.05)",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Scanned label"
                    className="w-20 h-20 object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(247,77,185,0.15)" }}
                    >
                      <Camera size={28} style={{ color: "#f74db9" }} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Tap to scan</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                        or upload from library
                      </p>
                    </div>
                  </>
                )}
              </button>

              {/* Skip / demo button */}
              <button
                onClick={handleUseDemoData}
                className="w-full mt-4 py-3 text-sm font-medium rounded-2xl transition-all active:scale-98"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
              >
                Use demo data instead
              </button>
            </div>
          )}

          {/* ── SCANNING STATE ── */}
          {step === "scanning" && (
            <div className="animate-fade-in-up flex flex-col items-center justify-center py-12 gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(247,77,185,0.2)" }}
              >
                <div
                  className="animate-spin rounded-full border-2 border-current border-t-transparent"
                  style={{ width: 28, height: 28, color: "#f74db9" }}
                />
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Scanning"
                  className="w-32 h-32 object-cover rounded-2xl opacity-70"
                />
              )}
              <p className="text-lg font-bold text-foreground">Analyzing label...</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Gemini is reading the nutrition facts
              </p>
            </div>
          )}

          {/* ── STEP 2: GRAMS ── */}
          {step === "grams" && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-bold text-foreground mb-1">How much did you eat?</h2>
              <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
                Enter the amount in grams
              </p>

              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="relative flex items-center justify-center">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="150"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    autoFocus
                    className="bg-transparent text-center font-black text-foreground outline-none w-48"
                    style={{
                      fontSize: "5rem",
                      letterSpacing: "-0.04em",
                      caretColor: "#f74db9",
                      borderBottom: "2px solid rgba(247,77,185,0.5)",
                    }}
                  />
                </div>
                <span className="text-lg font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                  grams
                </span>
              </div>

              {/* Quick-select chips */}
              <div className="flex gap-2 justify-center mb-8 flex-wrap">
                {[50, 100, 150, 200, 300].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrams(String(g))}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={{
                      background: grams === String(g) ? "#f74db9" : "rgba(255,255,255,0.08)",
                      color: grams === String(g) ? "#fff" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {g}g
                  </button>
                ))}
              </div>

              <button
                onClick={() => gramsNum > 0 && setStep("summary")}
                disabled={gramsNum <= 0}
                className="w-full py-4 rounded-3xl font-bold text-base text-white transition-all duration-200 active:scale-98 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #f74db9 0%, #c9269a 100%)" }}
              >
                Continue
              </button>
            </div>
          )}

          {/* ── STEP 3: SUMMARY ── */}
          {step === "summary" && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-bold text-foreground mb-1">Looks good!</h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                {scannedMacros ? "Scanned Food" : MOCK_FOOD_NAME} · {gramsNum}g
              </p>

              {/* Macro summary card */}
              <div className="glass-card p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Calculated Macros
                  </span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    based on {gramsNum}g
                  </span>
                </div>

                {/* Calories big */}
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="font-black text-foreground" style={{ fontSize: "3rem", letterSpacing: "-0.03em" }}>
                    {macros.calories}
                  </span>
                  <span className="text-lg font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>kcal</span>
                </div>

                {/* Macro row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Protein", value: macros.protein, color: "#60a5fa" },
                    { label: "Carbs", value: macros.carbs, color: "#fbbf24" },
                    { label: "Fat", value: macros.fat, color: "#f87171" },
                  ].map((m) => (
                    <div key={m.label} className="flex flex-col items-center rounded-2xl py-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {m.label}
                      </span>
                      <span className="font-bold text-lg text-foreground">{m.value}</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>g</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleLog}
                className="w-full py-4 rounded-3xl font-bold text-base text-white transition-all duration-200 active:scale-98"
                style={{ background: "linear-gradient(135deg, #f74db9 0%, #c9269a 100%)" }}
              >
                Log Food
              </button>
            </div>
          )}

          {/* ── STEP 4: LOGGING ── */}
          {step === "logging" && (
            <div className="animate-fade-in-up flex flex-col items-center justify-center py-12 gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(247,77,185,0.2)" }}
              >
                <Check size={28} style={{ color: "#f74db9" }} />
              </div>
              <p className="text-lg font-bold text-foreground">Logged!</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Updating your stats...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LogMealSheet;
