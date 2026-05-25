import { useState, useCallback } from "react";
import { type PopupType } from "../common/Popup";

interface PopupState {
  isOpen: boolean;
  type: PopupType;
  title: string;
  message: string;
  action?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showConfirm?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  requireInput?: boolean;
  expectedInputText?: string;
}

const initialState: PopupState = {
  isOpen: false,
  type: "info",
  title: "",
  message: "",
  autoClose: true,
  autoCloseDelay: 3000,
  showConfirm: false,
};

export const usePopup = () => {
  const [popupState, setPopupState] = useState<PopupState>(initialState);

  const showPopup = useCallback(
    (
      type: PopupType,
      title: string,
      message: string,
      options?: {
        action?: string;
        autoClose?: boolean;
        autoCloseDelay?: number;
        showConfirm?: boolean;
        onConfirm?: () => void;
        onClose?: () => void;
        requireInput?: boolean;
        expectedInputText?: string;
      },
    ) => {
      setPopupState({
        isOpen: true,
        type,
        title,
        message,
        action: options?.action,
        autoClose: options?.autoClose ?? true,
        autoCloseDelay: options?.autoCloseDelay ?? 3000,
        showConfirm: options?.showConfirm ?? false,
        onConfirm: options?.onConfirm,
        onClose: options?.onClose,
        requireInput: options?.requireInput,
        expectedInputText: options?.expectedInputText,
      });
    },
    [],
  );

  const showSuccess = useCallback(
    (title: string, message: string, action?: string) => {
      showPopup("success", title, message, { action });
    },
    [showPopup],
  );

  const showError = useCallback(
    (title: string, message: string, action?: string) => {
      showPopup("error", title, message, { action, autoCloseDelay: 5000 });
    },
    [showPopup],
  );

  const showWarning = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      action?: string,
      requireInput?: boolean,
      expectedInputText?: string
    ) => {
      showPopup("warning", title, message, {
        action,
        showConfirm: true,
        onConfirm,
        autoClose: false,
        requireInput,
        expectedInputText,
      });
    },
    [showPopup],
  );

  const showInfo = useCallback(
    (title: string, message: string, action?: string) => {
      showPopup("info", title, message, { action });
    },
    [showPopup],
  );

  const closePopup = useCallback(() => {
    setPopupState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    popupState,
    showPopup,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closePopup,
  };
};