import { useContext } from "react";
import { createPortal } from "react-dom";
import { DialogContext } from "./TasksCol";
import { X } from "lucide-react";

function Modal({ children }: { children: React.ReactNode }) {
  const context: any = useContext(DialogContext);

  if (!context.openDialog) return;

  return createPortal(
    <div className="c-modal">
      <span
        className="c-modal__overlay"
        onClick={() => context.setOpenDialog(false)}
      ></span>
      <div className="c-modal__content">
        <button
          className="c-modal__close"
          onClick={() => context.setOpenDialog(false)}
        >
          <X />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
