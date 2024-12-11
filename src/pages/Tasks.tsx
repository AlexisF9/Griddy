import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import TasksColumn from "../components/TasksColumn";
import Sortable from "sortablejs";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X } from "lucide-react";
import Field from "../components/Field";
import { TasksContext } from "./Layout";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";

function Tasks() {
  const [openDialog, setOpenDialog] = useState(false);
  const [newColumn, setNewColumn] = useState(false);

  const {
    taskInfo,
    tasks,
    getTasksList,
    setTaskInfo,
  }: {
    taskInfo: {
      open: boolean;
      col: number | null;
      card: number | null;
    };
    tasks: [];
    getTasksList: () => void;
    setTaskInfo: (e: any) => void;
  } = useContext(TasksContext);

  useEffect(() => {
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

  const getTask = () => {
    if (tasks && tasks.length > 0 && taskInfo.col && taskInfo.card) {
      const col: any = tasks.find(
        (el: { id: number }) => el.id === taskInfo.col
      );

      if (col.cards && col.cards.length > 0) {
        return (
          col.cards &&
          col.cards.length > 0 &&
          col.cards.find((el: { id: number }) => el.id === taskInfo.card)
        );
      } else {
        return setTaskInfo({
          open: false,
          col: null,
          card: null,
        });
      }
    } else {
      return setTaskInfo({
        open: false,
        col: null,
        card: null,
      });
    }
  };

  const editTask = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const editedTask = {
      label: data.get("task-label"),
      description: data.get("task-desc") ?? "",
      date: data.get("task-date") ?? "",
      priority: data.get("task-priority"),
    };

    setOpenDialog(false);

    if (taskInfo.col && taskInfo.card) {
      const arr = localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks") ?? "")
        : [];

      const col = arr.find((el: { id: number }) => el.id === taskInfo.col);
      const colIndex = arr.indexOf(col);
      const card = col.cards.find(
        (el: { id: number }) => el.id === taskInfo.card
      );
      const cardIndex = col.cards.indexOf(card);

      arr[colIndex].cards[cardIndex] = {
        ...editedTask,
        id: taskInfo.card,
      };

      localStorage.setItem("tasks", JSON.stringify(arr));
      getTasksList();
    }
  };

  return (
    <div className={`c-tasks${taskInfo.open ? " c-tasks--open" : ""}`}>
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
        <Button
          icon={<X />}
          isLink={true}
          onClick={() =>
            setTaskInfo({
              open: false,
              col: taskInfo.col,
              card: taskInfo.card,
            })
          }
        />

        {taskInfo.card && taskInfo.col ? (
          <div>
            {getTask() ? (
              <div>
                <p>{getTask().label}</p>
                {getTask().description && <p>{getTask().description}</p>}
                <button onClick={() => setOpenDialog(true)}>Edit</button>
                <Modal open={openDialog} setOpen={setOpenDialog}>
                  <p className="c-h-l u-mb-16">
                    Modification de {getTask().label}
                  </p>
                  <form
                    className="c-tasks-column__new-task-form"
                    onSubmit={(e) => editTask(e)}
                  >
                    <TaskForm task={getTask()} />
                    <div className="c-tasks-column__new-task-action">
                      <p className="c-text-s u-mb-12">*Champs obligatoire</p>
                      <div>
                        <Button
                          color="secondary"
                          type="submit"
                          label="Ajouter une tâche"
                        />
                        <Button
                          isLink={true}
                          label="Annuler"
                          onClick={() => setOpenDialog(false)}
                        />
                      </div>
                    </div>
                  </form>
                </Modal>
              </div>
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
  );
}

export default Tasks;
