
import React from "react";

interface CategoryProgressProps {
  progress: number;
}

export function CategoryProgress({ progress }: CategoryProgressProps) {
  // Function to determine color based on progress
  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-gray-200 rounded-full h-2.5 ml-2">
        <div 
          className={`${getProgressColor(progress)} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 min-w-[3rem] text-right">
        {progress}%
      </span>
    </div>
  );
}
