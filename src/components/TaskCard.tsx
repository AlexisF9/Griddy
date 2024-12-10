import { Trash2 } from "lucide-react";
import Button from "./Button";
import { useContext, useState } from "react";
import { TasksContext } from "../pages/Tasks";
import Dropdown from "./Dropdown";
import Priority from "./Priority";

interface taskProps {
  card: {
    label: string;
    date?: string;
    id: number;
    description: string;
    priority: "normal" | "low" | "high" | "top";
  };
  colId: number;
}

function TaskCard(props: taskProps) {
  const { card, colId } = props;
  const [openDropdown, setOpenDropdown] = useState(false);
  const {
    setTaskInfo,
    getTasksList,
  }: { getTasksList: () => void; setTaskInfo: ({}) => void } =
    useContext(TasksContext);

  const removeTask = (cardId: number, colId: number) => {
    const arr = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") ?? "")
      : [];
    const col = arr.find((el: { id: number }) => el.id === colId);
    const colIndex = arr.indexOf(col);

    const card = col.cards.find((el: any) => el.id === cardId);
    const cardIndex = col.cards.indexOf(card);

    col.cards.splice(cardIndex, 1);

    arr[colIndex].cards = [...col.cards];

    localStorage.setItem("tasks", JSON.stringify(arr));
    getTasksList();
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
      <div className="c-task-card">
        <div
          className="c-task-card__content"
          onClick={() =>
            setTaskInfo({
              open: true,
              col: colId,
              card: card.id,
            })
          }
        >
          <p>{card.label}</p>
          <div className="c-task-card__infos">
            <Priority priority={card.priority} />
            {card.date && (
              <p
                className={`c-text-s${
                  dateInfos(card.date) === "past" ? " u-text-tertiary" : ""
                }`}
              >
                {dateInfos(card.date) === "today"
                  ? "Aujourd'hui"
                  : changeFormatDate(card.date)}
              </p>
            )}
          </div>
        </div>
        <div className="c-task-card__actions">
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
      </div>
    </>
  );
}

export default TaskCard;
