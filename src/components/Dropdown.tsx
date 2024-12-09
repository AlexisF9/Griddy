import { EllipsisVertical } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";

function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
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
        <button className="c-dropdown__action" onClick={() => setOpen(!open)}>
          <EllipsisVertical />
        </button>
        <div className={`c-dropdown__content ${open && "is-open"}`}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Dropdown;
