import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useAppStore } from "../store";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [allTasksToday, setAllTasksToday] = useState<
    { cards: { status: string; id: number }[]; col: number }[]
  >([]);

  const [allCompletedTasksToday, setAllCompletedTasksToday] = useState<
    { cards: { status: string; id: number }[]; col: number }[]
  >([]);

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
    tasks?.forEach((el: { id: number; cards: any }) => {
      el.cards.filter(
        (t: { date: string; status: string }) =>
          isToday(t.date) && t.status !== "finished"
      ).length > 0 &&
        setAllTasksToday((arr) => [
          ...arr,
          {
            cards: [
              ...el.cards.filter(
                (t: { date: string; status: string }) =>
                  isToday(t.date) && t.status !== "finished"
              ),
            ],
            col: el.id,
          },
        ]),
        el.cards.filter(
          (t: { date: string; status: string }) =>
            isToday(t.date) && t.status === "finished"
        ).length > 0 &&
          setAllCompletedTasksToday((arr) => [
            ...arr,
            {
              cards: [
                ...el.cards.filter(
                  (t: { date: string; status: string }) =>
                    isToday(t.date) && t.status === "finished"
                ),
              ],
              col: el.id,
            },
          ]);
    });

    return () => (setAllTasksToday([]), setAllCompletedTasksToday([]));
  }, [tasks]);

  return (
    <div className="c-dashboard">
      <h2 className="c-dashboard__title c-h-xl u-mb-24">
        Bienvenue sur ton board <span>{user}</span>
      </h2>
      {tasks && tasks.length > 0 ? (
        <>
          <div className="u-mb-32">
            <h3 className="c-text-l u-mb-12">Vos tâches d'aujourd'hui :</h3>
            {allTasksToday.length > 0 ? (
              <>
                <div className="c-dashboard__tasks-today">
                  {allTasksToday.map(
                    (el: { cards: { id: number }[]; col: number }) =>
                      el.cards.map((card) => (
                        <TaskCard
                          key={card.id}
                          card={card}
                          colId={el.col}
                          disabledDrag={true}
                          activeFinishButton={true}
                        />
                      ))
                  )}
                </div>
              </>
            ) : (
              <p>Vous n'avez aucune tâche aujourd'hui</p>
            )}
          </div>

          {allCompletedTasksToday.length > 0 && (
            <div>
              <h3 className="c-text-l u-mb-12">Tâches terminés :</h3>
              <div className="c-dashboard__tasks-today">
                {allCompletedTasksToday.map(
                  (el: { cards: { id: number }[]; col: number }) =>
                    el.cards.map((card) => (
                      <TaskCard
                        key={card.id}
                        card={card}
                        colId={el.col}
                        disabledDrag={true}
                        activeFinishButton={true}
                      />
                    ))
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <p className="c-text-m u-mb-16">
            Créez des tâches pour mettre à jour vos statistiques
          </p>
          <Button url="/tasks" label="Ajouter une tâche" />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
