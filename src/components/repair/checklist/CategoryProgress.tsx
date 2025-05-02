
import React from "react";

interface CategoryProgressProps {
  progress: number;
}

export function CategoryProgress({ progress }: CategoryProgressProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 min-w-[3rem] text-right">
        {progress}%
      </span>
    </div>
  );
}
