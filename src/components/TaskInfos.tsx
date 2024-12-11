import { useContext, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { TasksContext } from "../pages/Layout";
import { Pen, Trash2, X } from "lucide-react";
import { useRemoveTask } from "../hooks/useRemoveTask";
import Priority from "./Priority";

function TaskInfos() {
  const [openDialog, setOpenDialog] = useState(false);

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

  const getTask = () => {
    if (tasks && tasks.length > 0 && taskInfo.col && taskInfo.card) {
      const col: any = tasks.find(
        (el: { id: number }) => el.id === taskInfo.col
      );

      if (
        col.cards &&
        col.cards.length > 0 &&
        col.cards.find((el: { id: number }) => el.id === taskInfo.card)
      ) {
        return col.cards.find((el: { id: number }) => el.id === taskInfo.card);
      }

      return setTaskInfo({
        open: false,
        col: null,
        card: null,
      });
    }

    return setTaskInfo({
      open: false,
      col: null,
      card: null,
    });
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

  const removeTask = () => {
    if (taskInfo) {
      useRemoveTask(taskInfo.card, taskInfo.col);
      getTasksList();
    }
  };

  const changeFormatDate = (date: string) => {
    return date.toString().split("-").reverse().join("/");
  };

  return (
    <>
      <div
        className={`c-task-infos ${taskInfo.open ? "c-task-infos--open" : ""}`}
      >
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

        {taskInfo.card && taskInfo.col && getTask() && (
          <>
            <div className="c-task-infos__container">
              <div className="c-task-infos__content">
                <div className="c-task-infos__intro">
                  <p className="c-h-l">{getTask().label}</p>
                  <Button
                    isLink={true}
                    icon={<Pen />}
                    onClick={() => setOpenDialog(true)}
                  />
                </div>
                <div className="c-task-infos__short-infos">
                  <Priority priority={getTask().priority} />
                  {getTask().date && <p>{changeFormatDate(getTask().date)}</p>}
                </div>
                {getTask().description && <p>{getTask().description}</p>}
              </div>
              <div className="c-task-infos__remove">
                <Button
                  isLink={true}
                  icon={<Trash2 />}
                  color="tertiary"
                  label="Supprimer la tâche"
                  onClick={removeTask}
                />
              </div>
            </div>
            <Modal open={openDialog} setOpen={setOpenDialog}>
              <p className="c-h-l u-mb-16">
                Modification de{" "}
                <span className="u-text-tertiary">{getTask().label}</span>
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
          </>
        )}
      </div>
    </>
  );
}

export default TaskInfos;
