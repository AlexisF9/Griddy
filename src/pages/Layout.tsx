import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppStore } from "../store";
import { createContext, useEffect, useState } from "react";
import TaskInfos from "../components/TaskInfos";

export const TasksContext: any = createContext(null);

function Layout() {
  const { isAuth } = useAppStore();

  const [taskInfos, setTaskInfos] = useState<{
    open: boolean;
    col: number | null;
    card: number | null;
  }>({
    open: false,
    col: null,
    card: null,
  });

  const { setTasks } = useAppStore();

  useEffect(() => {
    setTasks();
  }, []);

  return (
    <>
      {isAuth ? (
        <TasksContext.Provider
          value={{
            taskInfo: taskInfos,
            setTaskInfo: (e: {
              open: boolean;
              col: number | null;
              card: number | null;
            }) => {
              setTaskInfos(e);
            },
          }}
        >
          <div className="layout">
            <Navbar />
            <div className="layout__content">
              <Outlet />
              <TaskInfos />
            </div>
            <Footer />
          </div>
        </TasksContext.Provider>
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
}

export default Layout;
