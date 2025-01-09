import { Clock9, GripVertical, Text, Trash2 } from "lucide-react";
import Button from "./Button";
import { useContext, useState } from "react";
import Dropdown from "./Dropdown";
import Priority from "./Priority";
import { TaskDetailType, TasksContext } from "../pages/Layout";
import { useRemoveTask } from "../hooks/useRemoveTask";
import { useAppStore } from "../store";
import { Bounce, toast } from "react-toastify";
import Tag from "./Tag";

interface taskProps {
  card: {
    label: string;
    date?: string;
    id: number;
    description: string;
    priority: "normal" | "low" | "high" | "top";
    status: string;
    cover?: {
      url: string;
      name: string;
    };
  };
  colId: number;
  disabledDrag: boolean;
}

function TaskCard(props: taskProps) {
  const { card, colId } = props;

  const [openDropdown, setOpenDropdown] = useState(false);

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
    toast.success("Votre tâche a été supprimée", {
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

  return (
    <div className={`c-task-card c-task-card--${card.priority}`}>
      {card?.cover?.url && <img src={card.cover.url} alt={card.cover.name} />}
      <div className="c-task-card__content">
        <div className="c-task-card__intro">
          <div className="c-task-card__intro-infos">
            {!props.disabledDrag && (
              <span className="c-tasks-column__col-drag">
                <GripVertical />
              </span>
            )}
            <Priority priority={card.priority} />
            {status.find((el) => el.value === card.status) && (
              <Tag
                label={
                  status.find((el) => el.value === card.status)?.label ?? ""
                }
              />
            )}
          </div>
          <Dropdown setOpen={setOpenDropdown} open={openDropdown}>
            <div className="c-tasks-column__col-action">
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

        <p
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
        </p>

        <div className="c-task-card__infos">
          {card.date && (
            <p className="c-text-s c-task-card__date">
              <Clock9 />
              {dateInfos(card.date) === "today"
                ? "Aujourd'hui"
                : changeFormatDate(card.date)}
            </p>
          )}
          {card.description && (
            <span title="Description">
              <Text />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
