import { Eye, Pen, Trash2 } from "lucide-react";
import Button from "./Button";
import { useContext, useState } from "react";
import { TasksContext } from "../pages/Tasks";
import Dropdown from "./Dropdown";

function TaskCard({
  card,
  colId,
}: {
  card: { label: string; id: number };
  colId: number;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { getTasksList }: { getTasksList: () => void } =
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

  return (
    <>
      <div className="c-task-card">
        <div className="c-task-card__intro">
          <p>{card.label}</p>
          <div className="c-task-card__actions">
            <Eye />
            <Dropdown setOpen={setOpenDropdown} open={openDropdown}>
              <div className="c-tasks-column__col-action">
                <Button
                  isLink={true}
                  icon={<Pen />}
                  color="white"
                  label="Modifier"
                />
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
      </div>
    </>
  );
}

export default TaskCard;
