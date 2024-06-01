import { Dialog } from "@headlessui/react";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
}

const Modal = ({
  onClose,
  open,
  cancelText,
  confirmText,
  description,
  onConfirm,
  title,
}: ModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white w-full py-6 px-2">
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl text-gray-900 font-bold mb-4">{title}</h2>
            <p className="text-gray-600 mb-8 text-center">{description}</p>

            <div className="flex space-x-4">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
