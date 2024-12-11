import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppStore } from "../store";
import { createContext, useEffect, useState } from "react";
import TaskInfos from "../components/TaskInfos";

export const TasksContext: any = createContext(null);

function Layout() {
  const { isAuth } = useAppStore();

  const [taskInfo, setTaskInfo] = useState<{
    open: boolean;
    col: number | null;
    card: number | null;
  }>({
    open: false,
    col: null,
    card: null,
  });
  const [tasks, setTasks] = useState([]);

  const getTasksList = () => {
    setTasks(
      localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks") ?? "")
        : []
    );
  };

  useEffect(() => {
    getTasksList();
  }, []);

  return (
    <>
      {isAuth ? (
        <TasksContext.Provider
          value={{
            taskInfo,
            tasks,
            getTasksList,
            setTaskInfo,
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
