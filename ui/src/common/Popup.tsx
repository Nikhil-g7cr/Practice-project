import { useState, useEffect } from "react";

export type PopupType = "success" | "error" | "info" | "warning";

export interface PopupConfig {
  isOpen: boolean;
  type: PopupType;
  title: string;
  message: string;
  action?: string; // e.g., "Added", "Deleted", "Updated"
  autoClose?: boolean;
  autoCloseDelay?: number; // in milliseconds
  onClose?: () => void;
  showConfirm?: boolean;
  onConfirm?: () => void;
  requireInput?: boolean;
  expectedInputText?: string;
}

interface PopupProps {
  config: PopupConfig;
  onClose: () => void;
}

const Popup = ({
  config: {
    isOpen,
    type,
    title,
    message,
    action,
    autoClose = true,
    autoCloseDelay = 3000,
    onClose: onConfigClose,
    showConfirm = false,
    onConfirm,
    requireInput = false,
    expectedInputText = "",
  },
  onClose,
}: PopupProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setInputValue(""); // Clear input whenever the popup opens

      if (autoClose && !showConfirm) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoClose, autoCloseDelay, showConfirm]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      onConfigClose?.();
    }, 300); // Match animation duration
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  };

  if (!isOpen && !isAnimating) return null;

  const isConfirmDisabled = requireInput && inputValue !== expectedInputText;

  // Type-based styling
  const typeStyles: Record<
    PopupType,
    { bg: string; icon: string; color: string }
  > = {
    success: {
      bg: "bg-primary/10",
      icon: "check_circle",
      color: "text-primary",
    },
    error: {
      bg: "bg-error/10",
      icon: "error",
      color: "text-error",
    },
    info: {
      bg: "bg-surface-container/20",
      icon: "info",
      color: "text-on-surface",
    },
    warning: {
      bg: "bg-tertiary-container/10",
      icon: "warning",
      color: "text-tertiary",
    },
  };

  const style = typeStyles[type];

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full max-w-lg rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 text-left shadow-lg transition-transform duration-300 sm:w-[520px] sm:p-7 ${
            isAnimating ? "scale-100" : "scale-90"
          }`}
        >
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`material-symbols-outlined text-[32px] ${style.color}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {style.icon}
            </span>
            <div className="flex-1">
              <h2 className="font-headline text-lg font-semibold text-on-surface">
                {title}
              </h2>
              {action && (
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mt-1">
                  {action}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <p className={`font-body text-sm text-on-surface-variant leading-relaxed ${requireInput ? 'mb-4' : 'mb-6'}`}>
            {message}
          </p>

          {/* Confirmation Input Field */}
          {requireInput && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type <strong>{expectedInputText}</strong> to confirm:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={expectedInputText}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            {showConfirm ? (
              <>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl font-headline text-sm font-semibold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className={`px-4 py-2 rounded-xl font-headline text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    type === "error" || type === "warning"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  Confirm
                </button>
              </>
            ) : (
              <button
                onClick={handleClose}
                className={`px-4 py-2 rounded-xl font-headline text-sm font-semibold text-white transition-colors ${
                  type === "success"
                    ? "bg-primary hover:bg-primary/90"
                    : type === "error"
                      ? "bg-error hover:bg-error/90"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
              >
                Got it!
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;