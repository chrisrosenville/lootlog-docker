"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "@/store/modal-store";

import { OutsideClickContainer } from "@/components/outsideClick/OutsideClick";
import { Button } from "@/components/ui/button";
const Modal = () => {
  const modalStore = useModalStore();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (modalStore.isVisible) {
      setIsAnimating(true);
    }
  }, [modalStore.isVisible]);

  const handleConfirm = () => {
    setIsAnimating(false);

    setTimeout(() => {
      modalStore.confirmAction();
      modalStore.dismiss();
    }, 200);
  };

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      modalStore.dismiss();
    }, 200);
  };

  return (
    <>
      {createPortal(
        <OutsideClickContainer
          onClose={handleDismiss}
          isOpen={modalStore.isVisible}
        >
          <div
            className={`z-[100] flex-col rounded-md bg-neutral-800 p-8 text-neutral-100 ${
              modalStore.isVisible ? "flex" : "none"
            } ${isAnimating ? "modal-enter" : "modal-exit"} `}
          >
            <span className="font-inter text-3xl font-bold text-inherit">
              {modalStore.title}
            </span>
            <p className="mb-8 mt-1 flex-1 text-inherit">
              {modalStore.paragraph}
            </p>
            <div className="flex flex-col justify-end gap-4 md:flex-row">
              <Button
                className="bg-neutral-200 hover:bg-neutral-400"
                onClick={handleDismiss}
              >
                {modalStore.cancelText}
              </Button>
              {modalStore.getConfirmButtonComponent(handleConfirm)}
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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  return (
    <>
      <div
        id="modal-root"
        className={`fixed inset-0 z-[90] h-[100svh] w-[svw] items-center justify-center backdrop-blur-sm ${
          isVisible ? "flex" : "hidden"
        } ${isAnimating ? "backdrop-enter" : "backdrop-exit"} `}
      >
        {isVisible && <Modal />}
      </div>
      {children}
    </>
  );
};
