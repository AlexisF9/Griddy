import { House, List, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import Button from "./Button";
import { useAppStore } from "../store";
import Modal from "./Modal";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => {
    if (window.innerWidth < 768) {
      setOpen(!open);
    }
  };

  const routes = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <House />,
    },
    {
      name: "Tâches",
      url: "/tasks",
      icon: <List />,
    },
  ];

  const { toggleAuth } = useAppStore();

  const handleDeco = () => {
    localStorage.clear();
    toggleAuth(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="c-navbar__open-navbar u-text-default"
      >
        <Menu />
      </button>
      <div className={`c-navbar${open ? " c-navbar--open" : ""}`}>
        <button onClick={handleOpen} className="c-navbar__close">
          <X />
        </button>
        <div>
          <h1 className="c-navbar__title u-align-center">Griddy</h1>
          <nav>
            <ul className="c-navbar__links">
              {routes.map((route, index) => (
                <li key={index}>
                  <NavLink
                    onClick={handleOpen}
                    to={route.url}
                    className={({ isActive }) =>
                      isActive
                        ? "c-navbar__link c-navbar__link--active"
                        : "c-navbar__link"
                    }
                  >
                    {route.icon}
                    {route.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Button
          icon={<LogOut />}
          color="warning"
          fullWidth={true}
          label="Réinitialiser"
          onClick={() => setOpenDialog(true)}
        />

        <Modal open={openDialog} setOpen={setOpenDialog}>
          <p className="c-h-l u-mb-16">Attention !</p>
          <p className="u-mb-24">
            Toutes vos données vont être supprimé du local storage.
          </p>
          <div className="c-navbar__modal-links">
            <Button
              icon={<LogOut />}
              color="warning"
              label="Réinitialiser"
              onClick={handleDeco}
            />
            <Button
              color="secondary"
              isLink={true}
              label="Annuler"
              onClick={() => setOpenDialog(false)}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Navbar;
