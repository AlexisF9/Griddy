import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

function TasksCol({
  id,
  name,
  cards,
  draggable,
  removeColumn,
}: {
  id: number;
  name: string;
  cards: { label: string }[];
  draggable: boolean;
  removeColumn: (e: any) => void;
}) {
  const [newTask, setNewTask] = useState(false);

  return (
    <div className="c-table__col">
      <div className="c-table__col-intro u-mb-12">
        {draggable && (
          <span className="c-table__col-drag">
            <GripVertical />
          </span>
        )}
        <p className="c-text-l">{name}</p>
      </div>
      <div>
        {cards && cards.length > 0
          ? cards.map((card: any) => (
              <div className="c-table__card" key={card.id}>
                {card.label}
              </div>
            ))
          : null}
      </div>

      <div className="c-table__çol-action">
        {newTask ? (
          <p>cc</p>
        ) : (
          <button
            className="c-table__new-task"
            onClick={() => setNewTask(true)}
          >
            <Plus /> Nouvelle tache
          </button>
        )}
        <button
          className="c-table__col-remove"
          onClick={() => removeColumn(id)}
        >
          <Trash2 /> Supprimer la colonne
        </button>
      </div>
    </div>
  );
}

export default TasksCol;
