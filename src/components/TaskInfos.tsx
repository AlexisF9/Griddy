import { useContext, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { TaskDetailType, TasksContext } from "../pages/Layout";
import { Clock9, Pen, Trash2, X } from "lucide-react";
import { useRemoveTask } from "../hooks/useRemoveTask";
import Priority from "./Priority";
import { useAppStore } from "../store";
import { useTransformBase64 } from "../hooks/useTransformBase64";

function TaskInfos() {
  const [openDialog, setOpenDialog] = useState(false);
  const { tasks, setTasks } = useAppStore();

  const {
    taskDetail,
    setTaskDetail,
  }: {
    taskDetail: TaskDetailType;
    setTaskDetail: (e: TaskDetailType) => {};
  } = useContext(TasksContext);

  const getTask = () => {
    if (!tasks?.length || !taskDetail.col || !taskDetail.card) {
      setTaskDetail({ open: false, col: null, card: null });
      return null;
    }

    const col = tasks.find((el) => el.id === taskDetail.col);
    const task = col?.cards?.find(
      (el: { id: number }) => el.id === taskDetail.card
    );

    if (!task) {
      setTaskDetail({ open: false, col: null, card: null });
      return null;
    }

    return task;
  };

  const editTask = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    let picture = null;
    const taskCover = data.get("task-cover") as {
      name: string;
      type: string;
      size: number;
      lastModified: number;
    };

    const pictureName = taskCover.name;
    const pictureType = taskCover.type;
    const pictureLastModified = taskCover.lastModified;
    const pictureSize = taskCover.size;

    if (pictureName && pictureSize > 0) {
      try {
        picture = await useTransformBase64(taskCover as File);
      } catch (err) {
        console.error("Erreur lors de la transformation de l'image", err);
      }
    }

    const currentCover = getTask()?.cover || {};
    const isSameCover =
      pictureName === currentCover.name &&
      pictureLastModified === currentCover.lastModified;

    const editedTask = {
      label: data.get("task-label"),
      description: data.get("task-desc") || "",
      date: data.get("task-date") || "",
      priority: data.get("task-priority"),
      status: data.get("task-status"),
      cover: isSameCover
        ? currentCover
        : pictureName && pictureSize > 0
        ? {
            url: picture,
            name: pictureName,
            type: pictureType,
            lastModified: pictureLastModified,
          }
        : {},
    };

    setOpenDialog(false);

    if (taskDetail.col && taskDetail.card) {
      const arr = [...tasks];
      const col = arr.find((el) => el.id === taskDetail.col);
      if (!col) return;

      const cardIndex = col.cards.findIndex(
        (el: { id: number }) => el.id === taskDetail.card
      );
      if (cardIndex === -1) return;

      col.cards[cardIndex] = { ...editedTask, id: taskDetail.card };
      localStorage.setItem("tasks", JSON.stringify(arr));
      setTasks();
    }
  };

  const removeTask = () => {
    if (taskDetail) {
      useRemoveTask(tasks, taskDetail.card, taskDetail.col);
      setTasks();
    }
  };

  const changeFormatDate = (date: string) => {
    return date.toString().split("-").reverse().join("/");
  };

  return (
    <>
      <div
        className={`c-task-infos ${
          taskDetail.open ? "c-task-infos--open" : ""
        }`}
      >
        <Button
          icon={<X />}
          color="secondary"
          isLink={true}
          onClick={() =>
            setTaskDetail({
              ...taskDetail,
              open: false,
            })
          }
        />

        {taskDetail.card && taskDetail.col && getTask() && (
          <>
            <div className="c-task-infos__container">
              <div className="c-task-infos__content">
                {getTask()?.cover?.url && <img src={getTask().cover.url} />}
                <div className="c-task-infos__intro">
                  <p className="c-h-l">{getTask().label}</p>
                  <Button
                    isLink={true}
                    color="secondary"
                    icon={<Pen />}
                    onClick={() => setOpenDialog(true)}
                  />
                </div>
                <div className="c-task-infos__short-infos">
                  <Priority priority={getTask().priority} />
                  {getTask().date && (
                    <p className="c-task-infos__date">
                      <Clock9 />
                      {changeFormatDate(getTask().date)}
                    </p>
                  )}
                </div>
                {getTask().description && <p>{getTask().description}</p>}
              </div>
              <div className="c-task-infos__remove">
                <Button
                  isLink={true}
                  icon={<Trash2 />}
                  color="warning"
                  label="Supprimer la tâche"
                  onClick={removeTask}
                />
              </div>
            </div>
            <Modal open={openDialog} setOpen={setOpenDialog}>
              <p className="c-h-l u-mb-16">
                Modification de : {getTask().label}
              </p>
              <form
                className="c-tasks-column__new-task-form"
                onSubmit={(e) => editTask(e)}
              >
                <TaskForm task={getTask()} edit={true} />
                <div className="c-tasks-column__new-task-action">
                  <p className="c-text-s u-mb-12">*Champs obligatoire</p>
                  <div>
                    <Button type="submit" label="Ajouter une tâche" />
                    <Button
                      color="secondary"
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
