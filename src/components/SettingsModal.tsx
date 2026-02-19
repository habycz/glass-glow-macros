import React, { useState, useEffect } from "react";
import { X, Key } from "lucide-react";
import { getApiKey, saveApiKey, clearApiKey } from "@/services/gemini";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      const existingKey = getApiKey();
      if (existingKey) {
        setApiKey(existingKey);
      }
      setSaved(false);
    }
  }, [open]);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey("");
    setSaved(false);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
      >
        <div className="glass-card-dark p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(247,77,185,0.15)" }}
              >
                <Key size={18} style={{ color: "#f74db9" }} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block" style={{ color: "rgba(255,255,255,0.7)" }}>
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 rounded-2xl text-sm font-medium text-foreground outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  caretColor: "#f74db9",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(247,77,185,0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                }}
              />
              <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                Get your API key from{" "}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#f74db9" }}
                  className="underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            {saved && (
              <div
                className="px-4 py-3 rounded-2xl animate-fade-in-up"
                style={{ background: "rgba(74, 222, 128, 0.15)", border: "1px solid rgba(74, 222, 128, 0.3)" }}
              >
                <p className="text-sm font-semibold text-center" style={{ color: "#4ade80" }}>
                  API Key saved successfully!
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-1 py-3 rounded-2xl font-bold text-base text-white transition-all duration-200 active:scale-98 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #f74db9 0%, #c9269a 100%)" }}
              >
                Save Key
              </button>
              {getApiKey() && (
                <button
                  onClick={handleClear}
                  className="px-4 py-3 rounded-2xl font-bold text-base transition-all duration-200 active:scale-98"
                  style={{ background: "rgba(248, 113, 113, 0.15)", color: "#f87171" }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
