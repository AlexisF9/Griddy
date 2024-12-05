import { useEffect, useState } from "react";
import { useAppStore } from "../App";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const { name } = useAppStore();
  const user = name ?? "";

  useEffect(() => {
    setTasks(
      localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks") ?? "")
        : []
    );
  }, []);

  return (
    <div className="c-dashboard">
      <h2 className="c-dashboard__title c-h-xl u-mb-8">
        Bienvenue sur ton board <span>{user}</span>
      </h2>
      <h3>Statistiques :</h3>
      <p>Nombre de colonnes : {tasks.length}</p>
    </div>
  );
}

export default Dashboard;
