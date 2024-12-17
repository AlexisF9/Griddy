import { Clock9, Image, Text, Trash2 } from "lucide-react";
import Button from "./Button";
import { useContext, useState } from "react";
import Dropdown from "./Dropdown";
import Priority from "./Priority";
import { TaskDetailType, TasksContext } from "../pages/Layout";
import { useRemoveTask } from "../hooks/useRemoveTask";
import { useAppStore } from "../store";

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
  color?: "primary" | "secondary";
}

function TaskCard(props: taskProps) {
  const { card, colId } = props;

  const [openDropdown, setOpenDropdown] = useState(false);

  const { tasks, setTasks } = useAppStore();

  const {
    setTaskDetail,
  }: {
    setTaskDetail: (e: TaskDetailType) => {};
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

  const status = [
    { label: "Tous", value: "all", checked: true },
    { label: "À faire", value: "to-do" },
    { label: "En cours", value: "progress" },
    { label: "En pause", value: "pause" },
    { label: "Terminé", value: "finished" },
  ];

  return (
    <>
      <div className={`c-task-card c-task-card--${card.priority}`}>
        <div className="c-task-card__intro">
          <div className="c-task-card__intro-infos">
            <Priority priority={card.priority} />
            <p className="c-task-card__status c-text-s">
              {status.find((el) => el.value === card.status)?.label}
            </p>
          </div>
          <Dropdown setOpen={setOpenDropdown} open={openDropdown}>
            <div className="c-tasks-column__col-action">
              <Button
                isLink={true}
                icon={<Trash2 />}
                color="white"
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
            <p
              className={`c-text-s c-task-card__date${
                dateInfos(card.date) === "past" ? " u-text-tertiary" : ""
              }`}
            >
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
          {card?.cover?.url && (
            <span title="Image de couverture">
              <Image className="u-text-default c-task-card__cover" />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default TaskCard;
