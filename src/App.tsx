import { useState } from "react";
import Toasts from "./components/toast";
import clsx from "clsx";
import { AlertTriangle, CircleCheck, CircleX, Info, XIcon } from "lucide-react";

interface IToastData {
  id: number | string;
  title: React.ReactNode;
  message: React.ReactNode;
  type?: "success" | "error" | "info" | "warning";
}

const toastsInitial: IToastData[] = [
  {
    id: 1,
    title: "Success notification",
    message:
      "Lorem Ipsum 🧐 is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    type: "success",
  },
  {
    id: 2,
    title: "Error notification",
    message:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    type: "error",
  },
  {
    id: 3,
    title: "Info notification",
    message:
      "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
    type: "info",
  },
  {
    id: 4,
    title: "Warning notification",
    message: "This is a warning message",
    type: "warning",
  },
];

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

export default function App() {
  const [toasts, setToasts] = useState(toastsInitial);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="toaster">
        {isExpanded && toasts.length > 0 && (
          <div className="toaster-controls">
            <button
              className="btn btn-secondary toaster-control"
              onClick={() => setIsExpanded(false)}
            >
              Collapse All
            </button>
          </div>
        )}
        <Toasts<IToastData>
          isExpanded={isExpanded}
          onClickToast={() => setIsExpanded(true)}
          getKey={(t) => t.id.toString()}
          toasts={toasts}
          onDismiss={(toast) =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
          render={({ toast }) => (
            <>
              <button
                className={clsx("btn btn-ghost toast-close-btn")}
                onClick={() =>
                  setToasts((prev) => prev.filter((e) => e.id !== toast.id))
                }
              >
                <XIcon size={24} />
              </button>
              <header className="toast-header">
                <div className="toast-icon">{icons[toast.type || "info"]}</div>
                <h1 className="toast-title">{toast.title}</h1>
              </header>
              <p
                className={clsx("toast-description", {
                  truncate: !isExpanded,
                })}
              >
                {toast.message}
              </p>
            </>
          )}
        />
      </div>
    </>
  );
}

// export default function App() {
//   const [toasts, setToasts] = useState(toastsInitial);

//   return (
//     <>
//     <Toasts toasts={toasts} onUpdate={(toasts) => setToasts(toasts)} />
//     </>
//   );
// }
