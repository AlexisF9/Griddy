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
    if (tasks && tasks.length > 0 && taskDetail.col && taskDetail.card) {
      const col: any = tasks.find(
        (el: { id: number }) => el.id === taskDetail.col
      );

      if (
        col.cards &&
        col.cards?.length > 0 &&
        col.cards.find((el: { id: number }) => el.id === taskDetail.card)
      ) {
        return col.cards.find(
          (el: { id: number }) => el.id === taskDetail.card
        );
      }

      return setTaskDetail({
        open: false,
        col: null,
        card: null,
      });
    }

    return setTaskDetail({
      open: false,
      col: null,
      card: null,
    });
  };

  const editTask = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    let picture = null;

    const pictureName = (data.get("task-cover") as { name: string }).name;
    const pictureType = (data.get("task-cover") as { type: string }).type;
    const pictureLastModified = (
      data.get("task-cover") as { lastModified: number }
    ).lastModified;
    const pictureSize = (data.get("task-cover") as { size: number }).size;

    if (pictureName !== "" && pictureSize > 0) {
      try {
        const res = await useTransformBase64(data.get("task-cover") as File);
        picture = res;
      } catch (err) {
        console.log(err);
      }
    }

    const editedTask = {
      label: data.get("task-label"),
      description: data.get("task-desc") ?? "",
      date: data.get("task-date") ?? "",
      priority: data.get("task-priority"),
      status: data.get("task-status"),
      cover:
        (pictureName === getTask()?.cover?.name &&
          pictureLastModified === getTask()?.cover?.lastModified) ||
        (pictureName === "" && pictureSize === 0)
          ? {
              url: getTask()?.cover?.url,
              name: getTask()?.cover?.name,
              type: getTask()?.cover?.type,
              lastModified: getTask()?.cover?.lastModified,
            }
          : {
              url: picture,
              name: pictureName,
              type: pictureType,
              lastModified: pictureLastModified,
            },
    };

    setOpenDialog(false);

    if (taskDetail.col && taskDetail.card) {
      const arr = [...tasks];
      const col = arr.find((el: { id: number }) => el.id === taskDetail.col);
      const colIndex = arr.indexOf(col);
      const card = col.cards.find(
        (el: { id: number }) => el.id === taskDetail.card
      );
      const cardIndex = col.cards.indexOf(card);

      arr[colIndex].cards[cardIndex] = {
        ...editedTask,
        id: taskDetail.card,
      };

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
                  color="tertiary"
                  label="Supprimer la tâche"
                  onClick={removeTask}
                />
              </div>
            </div>
            <Modal open={openDialog} setOpen={setOpenDialog}>
              <p className="c-h-l u-mb-16">
                Modification de{" "}
                <span className="u-text-primary">{getTask().label}</span>
              </p>
              <form
                className="c-tasks-column__new-task-form"
                onSubmit={(e) => editTask(e)}
              >
                <TaskForm task={getTask()} edit={true} />
                <div className="c-tasks-column__new-task-action">
                  <p className="c-text-s u-mb-12">*Champs obligatoire</p>
                  <div>
                    <Button
                      color="secondary"
                      type="submit"
                      label="Ajouter une tâche"
                    />
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
