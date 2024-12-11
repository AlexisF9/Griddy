import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppStore } from "../store";

function Layout() {
  const { isAuth } = useAppStore();

  return (
    <>
      {isAuth ? (
        <div className="layout">
          <Navbar />
          <div className="layout__content">
            <Outlet />
          </div>
          <Footer />
        </div>
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
}

export default Layout;
