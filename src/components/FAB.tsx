import React from "react";
import { Camera } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fab-pulse flex items-center justify-center rounded-full text-white active:scale-95 transition-transform duration-150 select-none"
      style={{
        width: 64,
        height: 64,
        background: "linear-gradient(135deg, #f74db9 0%, #c9269a 100%)",
      }}
      aria-label="Log a meal"
    >
      <Camera size={26} strokeWidth={2} />
    </button>
  );
};

export default FAB;
