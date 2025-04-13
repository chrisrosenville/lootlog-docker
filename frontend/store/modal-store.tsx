import { create } from "zustand";

interface ModalState {
  title: string;
  paragraph: string;
  cancelText: string;
  confirmAction: () => void;
  getConfirmButtonComponent: (onConfirm: () => void) => React.ReactNode;

  isVisible: boolean;
  show: (
    title: string,
    paragraph: string,
    cancelText: string,
    confirmAction: () => void,
    getConfirmButtonComponent: (onConfirm: () => void) => React.ReactNode,
  ) => void;
  dismiss: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  title: "",
  paragraph: "",
  cancelText: "Cancel",
  confirmAction: () => {},
  isVisible: false,
  getConfirmButtonComponent: () => null,
  show: (
    title: string,
    paragraph: string,
    cancelText: string,
    confirmAction: () => void,
    getConfirmButtonComponent: (onConfirm: () => void) => React.ReactNode,
  ) =>
    set((state) => ({
      ...state,
      title,
      paragraph,
      cancelText,
      confirmAction,
      getConfirmButtonComponent,
      isVisible: true,
    })),
  dismiss: () => set((state) => ({ ...state, isVisible: false })),
}));
