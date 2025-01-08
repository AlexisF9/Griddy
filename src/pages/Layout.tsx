import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppStore } from "../store";
import { createContext, useEffect, useState } from "react";
import TaskInfos from "../components/TaskInfos";

export interface TaskDetailType {
  open: boolean;
  col: number | null;
  card: number | null;
}

export const TasksContext: React.Context<TaskDetailType | any> = createContext({
  open: false,
  col: null,
  card: null,
});

function Layout() {
  const { isAuth } = useAppStore();

  const [taskDetail, setTaskDetail] = useState<TaskDetailType>({
    open: false,
    col: null,
    card: null,
  });

  const tasksStatus = [
    { label: "Tous", value: "all", checked: true },
    { label: "À faire", value: "to-do" },
    { label: "En cours", value: "progress" },
    { label: "En pause", value: "pause" },
    { label: "Terminé", value: "finished" },
  ];

  const { setTasks } = useAppStore();

  useEffect(() => {
    setTasks();
  }, []);

  return (
    <>
      {isAuth ? (
        <TasksContext.Provider
          value={{
            status: tasksStatus,
            taskDetail,
            setTaskDetail,
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
