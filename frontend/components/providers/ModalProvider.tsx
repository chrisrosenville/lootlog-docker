"use client";

import { createPortal } from "react-dom";
import { useModalStore } from "@/store/modal-store";

import { OutsideClickContainer } from "@/components/outsideClick/OutsideClick";
import { Button } from "@/components/ui/button";

const Modal = () => {
  const modalStore = useModalStore();

  const handleConfirm = () => {
    modalStore.confirmAction();
    modalStore.dismiss();
  };

  return (
    <>
      {createPortal(
        <OutsideClickContainer
          onClose={modalStore.dismiss}
          isOpen={modalStore.isVisible}
        >
          <div
            className={`z-[100] max-h-[40rem] min-h-[10svh] min-w-[25svw] max-w-[40rem] flex-col rounded-md bg-neutral-800 p-4 text-neutral-100 ${
              modalStore.isVisible ? "flex" : "none"
            }`}
          >
            <span className="text-3xl font-bold text-inherit">
              {modalStore.title}
            </span>
            <p className="mb-8 mt-2 flex-1 font-normal text-inherit">
              {modalStore.paragraph}
            </p>
            <div className="flex flex-col justify-end gap-4 md:flex-row">
              <Button
                className="bg-neutral-200 hover:bg-neutral-400"
                onClick={modalStore.dismiss}
              >
                {modalStore.cancelText}
              </Button>
              {modalStore.confirmButtonType === "primary" && (
                <Button
                  className="bg-blue-600 text-neutral-100 hover:bg-blue-800"
                  onClick={handleConfirm}
                >
                  {modalStore.confirmText}
                </Button>
              )}
              {modalStore.confirmButtonType === "delete" && (
                <Button
                  className="bg-red-600 text-neutral-100 hover:bg-red-800"
                  onClick={handleConfirm}
                >
                  {modalStore.confirmText}
                </Button>
              )}
            </div>
          </div>
        </OutsideClickContainer>,
        document.getElementById("modal-root")!,
      )}
    </>
  );
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const isVisible = useModalStore().isVisible;

  return (
    <>
      <div
        id="modal-root"
        className={`fixed inset-0 z-[90] h-[100svh] w-[svw] items-center justify-center bg-neutral-950/50 backdrop-blur-sm ${
          isVisible ? "flex" : "hidden"
        }`}
      >
        {isVisible && <Modal />}
      </div>
      {children}
    </>
  );
};
