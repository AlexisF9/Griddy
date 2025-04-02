import { createPortal } from "react-dom";
import { X } from "lucide-react";

function PdfModal({
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
      <div className="c-pdf-modal">
        <span
          className="c-pdf-modal__overlay"
          onClick={() => setOpen(false)}
        ></span>
        <div className="c-pdf-modal__content">
          <button className="c-pdf-modal__close" onClick={() => setOpen(false)}>
            <X />
          </button>
          {children}
        </div>
      </div>,
      document.body
    )
  );
}

export default PdfModal;
