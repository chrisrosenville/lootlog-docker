import { useModalStore } from "@/store/modal-store";

import { Modal } from "./Modal";

export const ModalRoot = () => {
  const isVisible = useModalStore().isVisible;

  return (
    <div
      id="modal-root"
      className={`fixed inset-0 z-[90] h-[100svh] w-[svw] items-center justify-center bg-neutral-950/50 backdrop-blur-sm ${
        isVisible ? "flex" : "hidden"
      }`}
    >
      {isVisible && <Modal />}
    </div>
  );
};
