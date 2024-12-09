import { createContext, useEffect, useState } from "react";
import Button from "../components/Button";
import TasksCol from "../components/TasksCol";
import Sortable from "sortablejs";

export const DialogContext: any = createContext(null);

function Tasks() {
  const [openDialog, setOpenDialog] = useState(false);
  const [newColumn, setNewColumn] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasksList();
  }, []);

  const table: HTMLUListElement | any = document.querySelector("#table");

  if (table) {
    new Sortable(table, {
      animation: 150,
      draggable: ".c-table__col",
      handle: ".c-table__col-drag",
      ghostClass: "c-table__on-drag",
      onSort: (e) => {
        const arr = localStorage.getItem("tasks")
          ? JSON.parse(localStorage.getItem("tasks") ?? "")
          : [];
        let numberOfDeletedElm = 1;
        const elm = arr.splice(e.oldIndex, numberOfDeletedElm)[0];
        numberOfDeletedElm = 0;
        arr.splice(e.newIndex, numberOfDeletedElm, elm);

        localStorage.setItem("tasks", JSON.stringify(arr));
        getTasksList();
      },
    });
  }

  const getTasksList = () => {
    setTasks(
      localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks") ?? "")
        : []
    );
  };

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
      getTasksList();
    } else {
      window.alert("Cette colonne existe déjà");
    }
  };

  const removeColumn = (id: number) => {
    const col = tasks.find((el: { id: number }) => el.id === id);
    if (col) {
      const tasksCopy = [...tasks];
      const index = tasksCopy.indexOf(col);
      tasksCopy.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasksCopy));
      getTasksList();
    }
  };

  return (
    <DialogContext.Provider
      value={{
        openDialog,
        setOpenDialog,
      }}
    >
      <div className="c-tasks">
        <div className="c-tasks__intro">
          <h2 className="c-h-l u-mb-16">Mes taches</h2>

          {newColumn ? (
            <div className="c-tasks__new-col">
              <form onSubmit={(e) => createColumn(e)}>
                <label htmlFor="name">Nom de la colonne</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="c-input"
                  required
                />
                <div>
                  <Button type="submit" color="secondary" label="Créer" />
                  <Button
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

        <div className="c-table" id="table">
          {tasks && tasks.length > 0 ? (
            tasks.map((col: any) => (
              <TasksCol
                key={col.id}
                draggable={tasks.length > 1 ? true : false}
                id={col.id}
                name={col.name}
                cards={col.cards}
                removeColumn={removeColumn}
              />
            ))
          ) : (
            <p>
              Vous n'avez pas de tâches. Crée une colonne pour ajouter une
              nouvelle tâche.
            </p>
          )}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export default Tasks;
