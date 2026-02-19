import React from "react";
import { Camera } from "lucide-react";

interface FABProps {
  onClick: () => void;
  loading?: boolean;
}

const FAB: React.FC<FABProps> = ({ onClick, loading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="fab-pulse flex items-center justify-center rounded-full text-white active:scale-95 transition-transform duration-150 select-none disabled:opacity-70"
      style={{
        width: 64,
        height: 64,
        background: "linear-gradient(135deg, #f74db9 0%, #c9269a 100%)",
      }}
      aria-label="Log a meal"
    >
      {loading ? (
        <div
          className="animate-spin rounded-full border-2 border-white border-t-transparent"
          style={{ width: 26, height: 26 }}
        />
      ) : (
        <Camera size={26} strokeWidth={2} />
      )}
    </button>
  );
};

export default FAB;
