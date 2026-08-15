import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        if (toast.type === "error") Icon = AlertCircle;
        if (toast.type === "warning") Icon = AlertTriangle;
        if (toast.type === "info") Icon = Info;

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <Icon size={20} className="toast-icon" />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
