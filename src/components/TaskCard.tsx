import { Trash2 } from "lucide-react";
import Button from "./Button";

function TaskCard({
  card,
  colId,
}: {
  card: { label: string; id: number };
  colId: number;
}) {
  const removeTask = (cardId: number, colId: number) => {
    console.log(cardId, colId);

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
  };

  return (
    <>
      <div className="c-table__card">
        <p>{card.label}</p>
        <Button
          onClick={() => removeTask(card.id, colId)}
          icon={<Trash2 />}
          isLink={true}
        />
      </div>
    </>
  );
}

export default TaskCard;
