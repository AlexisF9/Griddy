import { createPortal } from "react-dom";
import { X } from "lucide-react";

function Modal({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    open &&
    createPortal(
      <div className="c-modal">
        <span
          className="c-modal__overlay"
          onClick={() => setOpen(false)}
        ></span>
        <div className="c-modal__content">
          <button className="c-modal__close" onClick={() => setOpen(false)}>
            <X />
          </button>
          {children}
        </div>
      </div>,
      document.body
    )
  );
}

export default Modal;
