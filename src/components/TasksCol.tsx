import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

function TasksCol({
  id,
  name,
  cards,
  removeColumn,
}: {
  id: number;
  name: string;
  cards: { label: string }[];
  removeColumn: (e: any) => void;
}) {
  const [newTask, setNewTask] = useState(false);

  return (
    <li className="c-table__col">
      <p className="c-text-l u-mb-12">{name}</p>
      <button className="c-table__col-remove">
        <Trash2 onClick={() => removeColumn(id)} />
      </button>
      <div>
        {cards && cards.length > 0
          ? cards.map((card: any) => (
              <div className="c-table__card" key={card.id}>
                {card.label}
              </div>
            ))
          : null}
      </div>
      {newTask ? (
        <p>cc</p>
      ) : (
        <a className="c-table__new-task" onClick={() => setNewTask(true)}>
          <Plus /> Nouvelle tache
        </a>
      )}
    </li>
  );
}

export default TasksCol;
