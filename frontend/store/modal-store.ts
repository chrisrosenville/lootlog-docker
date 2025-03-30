import { create } from "zustand";

const buttonTypes = ["primary", "delete"] as const;

interface ModalState {
  title: string;
  paragraph: string;
  cancelText: string;
  confirmText: string;
  confirmAction: () => void;
  confirmButtonType: (typeof buttonTypes)[number];

  isVisible: boolean;
  show: (
    title: string,
    paragraph: string,
    cancelText: string,
    confirmText: string,
    confirmAction: () => void,
    confirmButtonType: (typeof buttonTypes)[number],
  ) => void;
  dismiss: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  title: "",
  paragraph: "",
  cancelText: "Cancel",
  confirmText: "Confirm",
  confirmAction: () => {},
  isVisible: false,
  confirmButtonType: "primary",
  show: (
    title: string,
    paragraph: string,
    cancelText: string,
    confirmText: string,
    confirmAction: () => void,
    confirmButtonType: (typeof buttonTypes)[number],
  ) =>
    set((state) => ({
      ...state,
      title,
      paragraph,
      cancelText,
      confirmText,
      confirmAction,
      confirmButtonType,
      isVisible: true,
    })),
  dismiss: () => set((state) => ({ ...state, isVisible: false })),
}));
