import { useEffect, useState } from "react";
import Button from "../components/Button";
import TasksColumn from "../components/TasksColumn";
import Sortable from "sortablejs";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Field from "../components/Field";
import { useAppStore } from "../store";
import ToggleButtons from "../components/ToggleButtons";

function Tasks() {
  const [newColumn, setNewColumn] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { setTasks, tasks } = useAppStore();

  useEffect(() => {
    const table: any = document.querySelector("#table");

    if (table) {
      new Sortable(table, {
        animation: 150,
        swapThreshold: 1,
        draggable: ".c-tasks-column__col",
        handle: ".c-tasks-column__col-drag",
        ghostClass: "c-tasks-column__on-drag",
        onEnd: (e: any) => {
          const arr = [...tasks];
          let numberOfDeletedElm = 1;
          const elm = arr.splice(e.oldIndex, numberOfDeletedElm)[0];
          numberOfDeletedElm = 0;
          arr.splice(e.newIndex, numberOfDeletedElm, elm);

          localStorage.setItem("tasks", JSON.stringify(arr));
          setTasks();
        },
      });
    }
  }, []);

  const createColumn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const oldTasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") ?? "")
      : [];

    if (
      !oldTasks.find((el: { name: string }) => el.name === data.get("name"))
    ) {
      const createCol = {
        name: data.get("name"),
        id: Date.now(),
        cards: [],
      };

      const newTasks = [createCol, ...oldTasks];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setNewColumn(false);
      setTasks();
      toast.success("Une nouvelle colonne à été ajouté", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } else {
      toast.error("Cette colonne existe déjà", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const removeColumn = (id: number) => {
    const col = tasks.find((el: { id: number }) => el.id === id);
    if (col) {
      const tasksCopy = [...tasks];
      const index = tasksCopy.indexOf(col);
      tasksCopy.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasksCopy));
      setTasks();
    }
  };

  const status = [
    { label: "Tous", value: "all", checked: true },
    { label: "À faire", value: "to-do" },
    { label: "En cours", value: "progress" },
    { label: "En pause", value: "pause" },
    { label: "Terminé", value: "finished" },
  ];

  return (
    <div className="c-tasks">
      <div className="c-tasks__content">
        <div className="c-tasks__intro">
          <h2 className="c-h-l u-mb-16">Mes taches</h2>
          <ToastContainer />
          {newColumn ? (
            <div className="c-tasks__new-col">
              <form onSubmit={(e) => createColumn(e)}>
                <Field
                  required={true}
                  id="name"
                  name="name"
                  placeholder="Nom de la colonne"
                />
                <div>
                  <Button type="submit" color="secondary" label="Créer" />
                  <Button
                    color="secondary"
                    isLink={true}
                    label="Annuler"
                    onClick={() => setNewColumn(false)}
                  />
                </div>
              </form>
            </div>
          ) : (
            <Button
              color="secondary"
              label="Ajouter une colonne"
              onClick={() => setNewColumn(true)}
            />
          )}
        </div>

        {tasks && tasks.length > 0 ? (
          <>
            {tasks.filter((el) => el.cards?.length > 0)?.length > 0 && (
              <>
                <p className="c-text-m u-mb-8">Filtrer les statuts</p>
                <div className="u-mb-24">
                  <ToggleButtons
                    name="tasks-status"
                    list={status}
                    updateState={setStatusFilter}
                  />
                </div>
              </>
            )}

            <div className="c-tasks-column" id="table">
              {tasks.map((col: any) => (
                <TasksColumn
                  key={col.id}
                  draggable={tasks.length > 1 ? true : false}
                  id={col.id}
                  name={col.name}
                  cards={col.cards}
                  removeColumn={removeColumn}
                  statusFilter={statusFilter}
                />
              ))}
            </div>
          </>
        ) : (
          <p>
            Vous n'avez pas de tâches. Crée une colonne pour ajouter une
            nouvelle tâche.
          </p>
        )}
      </div>
    </div>
  );
}

export default Tasks;
