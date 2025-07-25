export interface IToast {
  id: number | string;
  title: React.ReactNode;
  message: React.ReactNode;
  type?: "error" | "info" | "success" | "warning";
}