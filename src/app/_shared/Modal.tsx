"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
  children: ReactNode;
  onClose?: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    const cb = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", cb);
    return () => document.removeEventListener("keydown", cb);
  });

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      onTouchStart={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {children}
    </div>,
    document.getElementById("modals")!
  );
};

export default Modal;
