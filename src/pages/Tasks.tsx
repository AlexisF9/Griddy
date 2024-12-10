import { createContext, useEffect, useState } from "react";
import Button from "../components/Button";
import TasksColumn from "../components/TasksColumn";
import Sortable from "sortablejs";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TasksContext: any = createContext(null);

function Tasks() {
  const [newColumn, setNewColumn] = useState(false);
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

  useEffect(() => {
    getTasksList();

    const table: any = document.querySelector("#table");

    if (table) {
      new Sortable(table, {
        animation: 150,
        swapThreshold: 1,
        draggable: ".c-tasks-column__col",
        handle: ".c-tasks-column__col-drag",
        ghostClass: "c-tasks-column__on-drag",
        onEnd: (e) => {
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
  }, []);

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
      getTasksList();
    }
  };

  const getTask = (colId: number, cardId: number) => {
    if (tasks && tasks.length > 0) {
      const col: any = tasks.find((el: { id: number }) => el.id === colId);
      return (
        col.cards &&
        col.cards.length > 0 &&
        col.cards.find((el: { id: number }) => el.id === cardId)
      );
    }
  };

  return (
    <TasksContext.Provider
      value={{
        getTasksList,
        setTaskInfo,
      }}
    >
      <div className={`c-tasks${taskInfo.open ? " c-tasks--open" : ""}`}>
        <div className="c-tasks__content">
          <div className="c-tasks__intro">
            <h2 className="c-h-l u-mb-16">Mes taches</h2>
            <ToastContainer />
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

          <div className="c-tasks-column" id="table">
            {tasks && tasks.length > 0 ? (
              tasks.map((col: any) => (
                <TasksColumn
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

        <div className="c-tasks__task-infos">
          <button
            onClick={() =>
              setTaskInfo({
                open: false,
                col: taskInfo.col,
                card: taskInfo.card,
              })
            }
          >
            Close
          </button>

          {taskInfo.card && taskInfo.col ? (
            <div>
              {getTask(taskInfo.col, taskInfo.card) ? (
                getTask(taskInfo.col, taskInfo.card).label
              ) : (
                <p>
                  Un problème est survenu. Nous n'avons pas pu afficher votre
                  tâche.
                </p>
              )}
            </div>
          ) : (
            <p>Une erreur est survenu</p>
          )}
        </div>
      </div>
    </TasksContext.Provider>
  );
}

export default Tasks;
