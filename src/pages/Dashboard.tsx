import { useEffect, useState } from "react";
import { useAppStore } from "../App";
import Button from "../components/Button";

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
      <h2 className="c-dashboard__title c-h-xl u-mb-24">
        Bienvenue sur ton board <span className="u-text-tertiary">{user}</span>
      </h2>
      {tasks.length > 0 ? (
        <div>
          <h3 className="c-text-l u-mb-12">Statistiques :</h3>
          <p className="c-text-m">Nombre de colonnes : {tasks.length}</p>
        </div>
      ) : (
        <div>
          <p className="c-text-m u-mb-16">
            Créez des tâches pour mettre à jour vos statistiques
          </p>
          <Button color="secondary" url="/tasks" label="Ajouter une tâche" />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
