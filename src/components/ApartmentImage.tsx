import React from "react";

const colors = [
  { bg: "#f0f4ff", accent: "#0050cf", wall: "#e8edf5" },
  { bg: "#fff8f0", accent: "#cf6800", wall: "#f5ede0" },
  { bg: "#f0fff4", accent: "#00a843", wall: "#e0f5e8" },
  { bg: "#fff0f8", accent: "#cf0068", wall: "#f5e0ed" },
  { bg: "#f8f0ff", accent: "#6800cf", wall: "#ede0f5" },
  { bg: "#f0ffff", accent: "#00a8cf", wall: "#e0f5f5" },
];

interface ApartmentImageProps {
  index: number;
  rooms: number;
  className?: string;
}

export function ApartmentImage({ index, rooms, className = "" }: ApartmentImageProps) {
  const color = colors[index % colors.length];
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ background: color.bg }}>
      {/* Wall */}
      <div className="absolute inset-0" style={{ background: color.wall }}>
        {/* Window */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[35%] h-[40%] rounded-sm border-2" style={{ borderColor: color.accent + "40", background: "#e0f0ff" }}>
          <div className="absolute inset-0 flex">
            <div className="w-1/2 border-r" style={{ borderColor: color.accent + "30" }} />
            <div className="w-1/2" />
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-px" style={{ background: color.accent + "30" }} />
        </div>
        
        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: `linear-gradient(to bottom, ${color.accent}10, ${color.accent}20)` }}>
          <div className="absolute inset-0 opacity-30" style={{ 
            backgroundImage: `repeating-linear-gradient(90deg, ${color.accent}20 0px, transparent 1px, transparent 30px)`,
          }} />
        </div>
        
        {/* Furniture based on rooms */}
        {rooms >= 1 && (
          <div className="absolute bottom-[30%] left-[10%] w-[25%] h-[15%] rounded-sm" style={{ background: color.accent + "30" }}>
            <div className="absolute -top-[20%] left-[20%] w-[60%] h-[20%] rounded-t-sm" style={{ background: color.accent + "20" }} />
          </div>
        )}
        {rooms >= 2 && (
          <div className="absolute bottom-[30%] right-[10%] w-[20%] h-[20%] rounded-sm" style={{ background: color.accent + "25" }}>
            <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[30%] rounded-sm" style={{ background: color.accent + "15" }} />
          </div>
        )}
        {rooms >= 3 && (
          <div className="absolute bottom-[30%] left-[40%] w-[15%] h-[12%] rounded-sm" style={{ background: color.accent + "20" }} />
        )}
      </div>
      
      {/* Room badge */}
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: color.accent }}>
        {rooms === 1 ? "Студия" : `${rooms} комн.`}
      </div>
    </div>
  );
}
