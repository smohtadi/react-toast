import React, { useEffect, useState, type MouseEvent } from "react";
import { CSSTransition } from "react-transition-group";
import clsx from "clsx";
import { AlertTriangle, CircleCheck, CircleX, Info, XIcon } from "lucide-react";
import type { IToast } from "./toast-types";

interface IProps {
  toast: IToast;
  className?: string;
  isExpanded?: boolean;
  style?: React.CSSProperties;
  index?: number;
  ty?: number;
  onClose?: (id: number | string) => void;
  onClick?: (id: number | string) => void;
  onHeightChange?: (height: number, index: number) => void;
}

const icons = {
  info: <Info size={16} className="text-blue-500" aria-hidden="true" />,
  success: (
    <CircleCheck size={16} className="text-green-500" aria-hidden="true" />
  ),
  warning: (
    <AlertTriangle size={16} className="text-yellow-500" aria-hidden="true" />
  ),
  error: <CircleX className="size-6 text-red-500" aria-hidden="true" />,
};

export default function Toast({
  className,
  isExpanded,
  index = 0,
  toast,
  ty = 80,
  onClose,
  onClick,
  onHeightChange,
}: IProps) {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const nodeRef = React.useRef(null);
  const handleExit = () => {
    onClose?.(toast.id);
  };
  useEffect(() => {
    if (!nodeRef.current || !onHeightChange) return;
    const element = nodeRef.current as HTMLElement;
    onHeightChange?.(element.clientHeight, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);
  const handleClose = (e: MouseEvent) => {
    e.stopPropagation();
    if (onClose) {
      onClose(toast.id);
    }
  };
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isExpanded) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startX || !isDragging || !isExpanded) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setCurrentX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isExpanded) return;
    if (Math.abs(currentX) > 100) {
      setIsOpen(false);
    } else {
      setCurrentX(0);
    }
    setStartX(null);
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging && onClick) {
      onClick(toast.id);
    }
  };

  const toastStyle = {
    opacity: isExpanded ? undefined : Math.max(0.4, 1 - index * 0.3),
    transform: isExpanded
      ? `translate(${currentX}px, ${ty}px) ${isDragging ? "scale(0.85)" : ""}`
      : `translateY(${ty}px) scale(${1 - index * 0.05})`,
    zIndex: 1000 - index * 10,
  };

  return (
    <CSSTransition
      in={isOpen}
      nodeRef={nodeRef}
      timeout={300}
      classNames="toast"
      unmountOnExit
      onExited={handleExit}
    >
      <article
        ref={nodeRef}
        className={clsx(
          "glass w-full flex flex-col rounded-lg shadow-lg px-4 py-3",
          "absolute top-0 left-0 translate-y-0",
          "transition-all duration-300 ease",
          { "h-20": !isExpanded },
          { "select-none cursor-grab hover:scale-95": isExpanded },
          { "cursor-grabbing": isDragging },
          className
        )}
        style={toastStyle}
        onClick={handleClick}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        role="alert"
      >
        <button
          className={clsx(
            "absolute top-2 right-2 bg-transparent",
            "p0 m0 inline-flex items-center justify-center",
            "rounded-md border-0 outline-none focus-visible:outline-none",
            "focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          )}
          onClick={handleClose}
        >
          <XIcon size={24} />
        </button>
        <header className="flex items-center gap-2">
          <div className="shrink-0">{icons[toast.type || "info"]}</div>
          <h1 className="text-base font-medium">{toast.title}</h1>
        </header>
        <p className={clsx("text-sm text-gray-500", { truncate: !isExpanded })}>
          {toast.message}
        </p>
      </article>
    </CSSTransition>
  );
}
