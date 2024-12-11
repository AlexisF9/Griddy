import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import { useAppStore } from "../store";
import { TasksContext } from "./Layout";

function Dashboard() {
  const [allTasks, setAllTasks] = useState<any>([]);

  const { name } = useAppStore();
  const user = name ?? "";

  const {
    tasks,
  }: {
    tasks: [];
  } = useContext(TasksContext);

  const isToday = (date: string) => {
    const today = new Date();
    const dateFormated = new Date(date);
    return dateFormated.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)
      ? true
      : false;
  };

  useEffect(() => {
    tasks.forEach((el: any) => {
      setAllTasks((arr: any) => [
        ...arr,
        {
          cards: [...el.cards.filter((t: { date: string }) => isToday(t.date))],
          col: el.id,
        },
      ]);
    });

    return () => setAllTasks([]);
  }, [tasks]);

  return (
    <div className="c-dashboard">
      <h2 className="c-dashboard__title c-h-xl u-mb-24">
        Bienvenue sur ton board <span className="u-text-tertiary">{user}</span>
      </h2>
      {tasks.length > 0 ? (
        <div>
          <h3 className="c-text-l u-mb-12">Statistiques :</h3>
          <p className="c-text-m">Vos tâches d'aujourd'hui</p>

          {allTasks.map((el: { cards: []; col: number }) =>
            el.cards.map((card: any) => <div key={card.id}>{card.label}</div>)
          )}
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
