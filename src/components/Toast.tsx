import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { CSSTransition } from "react-transition-group";
import clsx from "clsx";

interface IToastRender<T> {
  toast: T;
  index: number;
}

interface IToastProps<T> {
  toast: T;
  className?: string;
  isExpanded?: boolean;
  style?: React.CSSProperties;
  index?: number;
  ty?: number;
  transitionTimeout?: number;
  setRef: (node: HTMLElement | null) => void;
  render: (props: IToastRender<T>) => React.ReactNode;
  onClick?: (toast: T) => void;
  onDismiss: (toast: T) => void;
}

interface IProps<T> {
  toasts: T[];
  className?: string;
  transitionTimeout?: number;
  isExpanded: boolean;
  onClickToast: (toast: T) => void;
  onDismiss: (toast: T) => void;
  getKey: (toast: T) => string;
  render: (props: IToastRender<T>) => React.ReactNode;
}

export default function Toasts<T>({
  className,
  toasts,
  transitionTimeout,
  isExpanded,
  onClickToast,
  onDismiss,
  getKey,
  render,
}: IProps<T>) {
  const [heights, setHeights] = useState<number[]>([]);
  const toastRefs = useRef<HTMLElement[]>([]);

  const setToastRef = useCallback((node: HTMLElement | null, index: number) => {
    if (node) {
      if (index < toastRefs.current.length) toastRefs.current[index] = node;
      else if (index === toastRefs.current.length) toastRefs.current.push(node);
      else throw new Error("Unexpected error.");
    } else {
      setHeights((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  useEffect(() => {
    setHeights(toastRefs.current.map((e) => e.offsetHeight));
  }, [toasts]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const newHeights = toastRefs.current.map((element) => {
        // const entry = entries.find((e) => e.target === element);
        // return entry ? entry.contentRect.height : element.offsetHeight;
        return element.offsetHeight;
      });
      setHeights(newHeights);
    });
    toastRefs.current.forEach((element) => {
      if (element) {
        resizeObserver.observe(element);
      }
    });
    return () => {
      resizeObserver.disconnect();
    };
  }, [toasts]);

  const getToastPosition = (index: number) => {
    if (!isExpanded) return index * 8;
    return heights.slice(0, index).reduce((acc, curr) => acc + curr + 20, 0);
  };

  return (
    <div
      className={clsx("relative w-full flex flex-col", className)}
      aria-expanded={isExpanded}
    >
      {toasts.map((toast, index) => (
        <Toast
          key={getKey(toast)}
          toast={toast}
          isExpanded={isExpanded}
          index={index}
          ty={getToastPosition(index)}
          setRef={(node: HTMLElement | null) => setToastRef(node, index)}
          transitionTimeout={transitionTimeout}
          render={render}
          onClick={onClickToast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

function Toast<T>({
  className,
  isExpanded,
  index = 0,
  toast,
  ty = 80,
  transitionTimeout = 300,
  setRef,
  render,
  onClick,
  onDismiss,
}: IToastProps<T>) {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const nodeRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setRef(nodeRef?.current);
  }, [setRef]);

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
      onClick(toast);
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
      timeout={transitionTimeout}
      classNames="toast"
      unmountOnExit
      onExited={() => onDismiss(toast)}
    >
      <article
        ref={nodeRef}
        className={clsx(
          "toast",
          { "toast-expanded": isExpanded },
          { "toast-dragging": isDragging },
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
        {render ? render({ toast, index }) : null}
      </article>
    </CSSTransition>
  );
}
