"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
}

export default function DualRangeSlider({
  min,
  max,
  step = 100,
  value,
  onChange,
  formatLabel = (v) => `৳${v.toLocaleString()}`,
}: DualRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value[0], value[1]]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          {formatLabel(localValue[0])}
        </span>
        <span className="text-gray-400">to</span>
        <span className="font-medium text-gray-700">
          {formatLabel(localValue[1])}
        </span>
      </div>

      <Slider
        value={localValue}
        onValueChange={(v) => setLocalValue(v as [number, number])}
        onValueCommitted={(v) => onChange(v as [number, number])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  );
}
