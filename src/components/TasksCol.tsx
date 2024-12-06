import { GripVertical, Plus, Trash2 } from "lucide-react";
import { createContext, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

export const DialogContext: any = createContext(null);

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
  const [openDialog, setOpenDialog] = useState(false);

  const createNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <DialogContext.Provider
      value={{
        openDialog,
        setOpenDialog,
      }}
    >
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
          <Modal>
            <p>Créé une tâche dans {name}</p>
            <form onSubmit={(e) => createNewTask(e)}>
              <input
                required
                className="c-input"
                name="label"
                id="label"
                placeholder="Nom de la tache"
              />
              <Button
                color="secondary"
                type="submit"
                label="Ajouter une tâche"
              />
              <Button label="Annuler" onClick={() => setOpenDialog(false)} />
            </form>
          </Modal>
          <button
            className="c-table__new-task"
            onClick={() => setOpenDialog(true)}
          >
            <Plus /> Nouvelle tache
          </button>
          <button
            className="c-table__col-remove"
            onClick={() => removeColumn(id)}
          >
            <Trash2 /> Supprimer la colonne
          </button>
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export default TasksCol;
