import React from "react";

const PersonaSelector = ({ selected, setSelected }) => {
  return (
    <div className="flex justify-center gap-3">
      <button
        onClick={() => setSelected("hitesh")}
        className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${
          selected === "hitesh"
            ? "bg-white text-indigo-700 shadow-lg scale-105 transform"
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
      >
        Hitesh Sir
      </button>
      <button
        onClick={() => setSelected("piyush")}
        className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${
          selected === "piyush"
            ? "bg-white text-purple-700 shadow-lg scale-105 transform"
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
      >
        Piyush Sir
      </button>
    </div>
  );
};

export default PersonaSelector;