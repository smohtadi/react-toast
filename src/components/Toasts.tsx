import { useState } from "react";
import type { IToast } from "./toast-types";
import Toast from "./Toast";

interface IProps {
  toasts: IToast[];
  onUpdate: (toasts: IToast[]) => void;
}

export default function Toasts({ toasts, onUpdate }: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heights, setHeights] = useState<number[]>([]);

  const handleHeightChange = (height: number, index: number) => {
    setHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  const getToastPosition = (index: number) => {
    if (!isExpanded) return index * 8;
    return heights.slice(0, index).reduce((acc, curr) => acc + curr + 20, 0);
  };

  const handleClose = (id: number | string) => {
    const target = toasts.findIndex((t) => t.id === id);
    if (target === -1) return;
    const newToasts = toasts.filter((t) => t.id !== id);
    onUpdate?.(newToasts);
    setHeights(heights.filter((_, i) => i !== target));
  };

  return (
    <>
      <div className="min-w-80 max-w-96">
        {isExpanded && toasts.length > 0 && (
          <div className="flex justify-end">
            <button
              className="px-4 py-2 font-medium text-sm rounded-lg bg-gray-100 border-0 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsExpanded(false)}
            >
              Collapse All
            </button>
          </div>
        )}
        <div className="relative w-full flex flex-col space-y-2">
          {toasts.map((toast, index) => (
            <Toast
              key={toast.id}
              toast={toast}
              isExpanded={isExpanded}
              index={index}
              onClick={() => setIsExpanded(true)}
              ty={getToastPosition(index)}
              onClose={handleClose}
              onHeightChange={handleHeightChange}
            />
          ))}
        </div>
      </div>
    </>
  );
}
