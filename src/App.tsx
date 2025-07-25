import { useState } from "react";
import Toasts from "./components/Toasts";

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

export default function App() {
  const [toasts, setToasts] = useState(toastsInitial);

  return (
    <>
    <Toasts toasts={toasts} onUpdate={(toasts) => setToasts(toasts)} />
    </>
  );
}
