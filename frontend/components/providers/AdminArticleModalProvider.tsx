"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useAdminArticleModalStore } from "@/store/admin-article-modal-store";
import { AdminArticleStatusModal } from "@/components/modals/AdminArticleStatusModal";

const Modal = () => {
  const adminArticleModalStore = useAdminArticleModalStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adminArticleModalStore.isVisible) {
      setIsAnimating(true);
    }
  }, [adminArticleModalStore.isVisible]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      adminArticleModalStore.dismiss();
    }, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className={`z-[100] flex-col rounded-lg bg-neutral-800 p-6 text-neutral-100 ${
              adminArticleModalStore.isVisible ? "flex" : "none"
            } ${isAnimating ? "modal-enter" : "modal-exit"}`}
          >
            <AdminArticleStatusModal onDismiss={handleDismiss} />
          </div>
        </div>,
        document.getElementById("admin-modal-root")!,
      )}
    </>
  );
};

export const AdminArticleModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isVisible = useAdminArticleModalStore().isVisible;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  return (
    <>
      <div
        id="admin-modal-root"
        className={`fixed inset-0 z-[90] h-[100svh] w-[svw] items-center justify-center backdrop-blur-sm ${
          isVisible ? "flex" : "hidden"
        } ${isAnimating ? "backdrop-enter" : "backdrop-exit"}`}
      >
        {isVisible && <Modal />}
      </div>
      {children}
    </>
  );
};
