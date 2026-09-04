import { Toaster, ToastBar, toast } from "react-hot-toast";
import { CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";

const toastIcon = (type: string) => {
  if (type === "success")
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-positive" />;
  if (type === "error")
    return <XCircle className="h-5 w-5 shrink-0 text-danger" />;
  if (type === "loading")
    return <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand" />;
  return <Info className="h-5 w-5 shrink-0 text-brand" />;
};

// App wide toast host styled with the design tokens used across the form.
export const AppToaster = () => (
  <Toaster
    position="top-right"
    gutter={12}
    toastOptions={{
      duration: 3500,
      error: { duration: 5000 },
      style: {
        background: "var(--color-card)",
        color: "var(--color-ink)",
        border: "1px solid var(--color-line)",
        borderRadius: "0.875rem",
        boxShadow: "0 12px 32px -12px rgba(15, 23, 42, 0.25)",
        padding: "0.625rem 0.75rem",
        maxWidth: "24rem",
      },
    }}
  >
    {(currentToast) => (
      <ToastBar toast={currentToast}>
        {({ message }) => (
          <div className="flex w-full items-center gap-3">
            {toastIcon(currentToast.type)}

            <div className="flex-1 text-sm leading-snug font-medium [&>div]:!m-0">
              {message}
            </div>

            {currentToast.type !== "loading" ? (
              <button
                type="button"
                onClick={() => toast.dismiss(currentToast.id)}
                aria-label="Dismiss notification"
                className="cursor-pointer rounded-lg p-1 text-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        )}
      </ToastBar>
    )}
  </Toaster>
);

export default AppToaster;
