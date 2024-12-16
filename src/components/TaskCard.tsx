import { Clock9, Image, Trash2 } from "lucide-react";
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
    cover?: {
      url: string;
      name: string;
    };
  };
  colId: number;
  color?: "primary" | "secondary";
}

function TaskCard(props: taskProps) {
  const { card, colId, color = "primary" } = props;

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

  return (
    <>
      <div className={`c-task-card c-task-card--${color}`}>
        <div className="c-task-card__intro">
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
          <Dropdown setOpen={setOpenDropdown} open={openDropdown}>
            <div className="c-tasks-column__col-action">
              <Button
                isLink={true}
                icon={<Trash2 />}
                color="tertiary"
                label="Supprimer"
                onClick={() => removeTask(card.id, colId)}
              />
            </div>
          </Dropdown>
        </div>
        {card.description && (
          <p className="c-task-card__description">{card.description}</p>
        )}

        <div className="c-task-card__infos">
          <Priority priority={card.priority} />
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
          {card?.cover?.url && (
            <Image className="u-text-default c-task-card__cover" />
          )}
        </div>
      </div>
    </>
  );
}

export default TaskCard;
