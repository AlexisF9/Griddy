import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useAppStore } from "../store";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [allTasksToday, setAllTasksToday] = useState<any>([]);

  const { name, tasks } = useAppStore();
  const user = name ?? "";

  const isToday = (date: string) => {
    const today = new Date();
    const dateFormated = new Date(date);
    return dateFormated.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)
      ? true
      : false;
  };

  useEffect(() => {
    tasks &&
      tasks.forEach((el: any) => {
        el.cards.filter((t: { date: string }) => isToday(t.date)).length > 0 &&
          setAllTasksToday((arr: any) => [
            ...arr,
            {
              cards: [
                ...el.cards.filter((t: { date: string }) => isToday(t.date)),
              ],
              col: el.id,
            },
          ]);
      });

    return () => setAllTasksToday([]);
  }, [tasks]);

  return (
    <div className="c-dashboard">
      <h2 className="c-dashboard__title c-h-xl u-mb-24">
        Bienvenue sur ton board <span className="u-text-tertiary">{user}</span>
      </h2>
      {tasks && tasks.length > 0 ? (
        <div>
          <h3 className="c-text-l u-mb-12">Vos tâches d'aujourd'hui :</h3>
          {allTasksToday.length > 0 ? (
            <>
              <div className="c-dashboard__tasks-today">
                {allTasksToday.map(
                  (el: { cards: { status: string }[]; col: number }) =>
                    el.cards
                      .filter((item) => item.status !== "finished")
                      .map((card: any) => (
                        <TaskCard
                          key={card.id}
                          card={card}
                          colId={el.col}
                          color="secondary"
                        />
                      ))
                )}
              </div>
            </>
          ) : (
            <p>Vous n'avez aucune tâche aujourd'hui</p>
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
