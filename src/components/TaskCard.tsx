import {
  Calendar,
  Check,
  Clock9,
  GripVertical,
  Pen,
  Text,
  Trash2,
} from "lucide-react";
import Button from "./Button";
import { useContext, useState } from "react";
import Dropdown from "./Dropdown";
import Priority from "./Priority";
import { TaskDetailType, TasksContext } from "../pages/Layout";
import { useRemoveTask } from "../hooks/useRemoveTask";
import { useAppStore } from "../store";
import Tag from "./Tag";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { useEditTask } from "../hooks/useEditTask";

interface taskProps {
  card: any;
  colId: number;
  disabledDrag: boolean;
  activeFinishButton?: boolean;
}

function TaskCard(props: taskProps) {
  const { card, colId, activeFinishButton = false } = props;

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { tasks, setTasks } = useAppStore();

  const {
    setTaskDetail,
    status,
  }: {
    setTaskDetail: (e: TaskDetailType) => {};
    status: { label: string; value: string }[];
  } = useContext(TasksContext);

  const removeTask = (cardId: number, colId: number) => {
    useRemoveTask(tasks, cardId, colId);
    setTasks();
  };

  const changeFormatDate = (date: string) => {
    return date.toString().split("-").reverse().join("/");
  };

  const dateInfos = (date: string) => {
    const today = new Date();
    const dateFormated = new Date(date);
    return dateFormated.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)
      ? "today"
      : dateFormated.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
      ? "past"
      : "future";
  };

  const finishTask = (id: number) => {
    const arr = [...tasks];
    const col = arr.find((el: { id: number }) => el.id === colId);
    if (!col) return;

    const cardIndex = col.cards.findIndex((el: { id: number }) => el.id === id);
    if (cardIndex === -1) return;

    const editTask = {
      ...card,
      status: "finished",
    };

    col.cards[cardIndex] = { ...editTask, id };
    localStorage.setItem("tasks", JSON.stringify(arr));
    setTasks();
  };

  const editTask = async (e: React.FormEvent<HTMLFormElement>) => {
    setOpenDialog(false);
    await useEditTask(e, card, colId, tasks);
    setTasks();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor((time / 60000) % 60);
    const hours = Math.floor(time / 3600000);

    console.log(minutes);
    return `${String(hours).padStart(2, "0")}h ${
      minutes > 0 ? String(minutes).padStart(2, "0") + "m" : ""
    }`;
  };

  return (
    <div className={`c-task-card c-task-card--${card.priority}`}>
      {card?.cover?.src && <img src={card.cover.src} alt={card.cover.name} />}
      <div className="c-task-card__content">
        <div className="c-task-card__intro">
          <div className="c-task-card__intro-infos">
            {!props.disabledDrag && (
              <span className="c-tasks-column__col-drag">
                <GripVertical />
              </span>
            )}
            <Priority priority={card.priority} />
            {status?.length > 0 &&
              status.find((el) => el.value === card.status) && (
                <Tag
                  label={
                    status.find((el) => el.value === card.status)?.label ?? ""
                  }
                />
              )}
          </div>
          <div className="c-task-card__intro-actions">
            {card.status !== "finished" && activeFinishButton && (
              <Button
                onClick={() => finishTask(card.id)}
                isLink={true}
                icon={<Check />}
              />
            )}
            <Dropdown setOpen={setOpenDropdown} open={openDropdown}>
              <div className="c-tasks-column__col-action">
                <Button
                  isLink={true}
                  color="light"
                  icon={<Pen />}
                  label="Modifier"
                  onClick={() => {
                    setOpenDialog(true);
                    setOpenDropdown(false);
                  }}
                />
                <Button
                  isLink={true}
                  icon={<Trash2 />}
                  color="warning"
                  label="Supprimer"
                  onClick={() => removeTask(card.id, colId)}
                />
              </div>
            </Dropdown>
          </div>
        </div>

        <button
          className="c-task-card__label"
          onClick={() => {
            colId &&
              card.id &&
              setTaskDetail({
                open: true,
                col: colId,
                card: card.id,
              });
          }}
        >
          {card.label}
        </button>

        <div className="c-task-card__infos">
          {card.date && (
            <p className="c-text-s c-task-card__date">
              <Calendar />
              {dateInfos(card.date) === "today"
                ? "Aujourd'hui"
                : changeFormatDate(card.date)}
            </p>
          )}
          {card.maxTime && (
            <span title="Temps max">
              <Clock9 />
              {formatTime(card.maxTime * 3600000)}
            </span>
          )}
          {card.description && (
            <span title="Description">
              <Text />
            </span>
          )}
        </div>
      </div>
      <Modal open={openDialog} setOpen={setOpenDialog}>
        <p className="c-h-l u-mb-16">Modification de : {card.label}</p>
        <form
          className="c-tasks-column__new-task-form"
          onSubmit={(e) => editTask(e)}
        >
          <TaskForm task={card} edit={true} />
          <div className="c-tasks-column__new-task-action">
            <p className="c-text-s u-mb-12">*Champs obligatoire</p>
            <div>
              <Button type="submit" label="Modifier la tâche" />
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
    </div>
  );
}

export default TaskCard;
