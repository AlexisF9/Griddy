import { Ellipsis } from "lucide-react";
import React from "react";
import { useEffect } from "react";

function Dropdown({
  setOpen,
  open,
  children,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  children: React.ReactNode;
}) {
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let handler = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="c-dropdown" ref={menuRef}>
        <button
          className="c-dropdown__action u-text-default"
          onClick={() => setOpen(!open)}
        >
          <Ellipsis />
        </button>
        <div className={`c-dropdown__content ${open && "is-open"}`}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Dropdown;
