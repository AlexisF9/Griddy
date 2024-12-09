import { GripVertical, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import { useContext } from "react";
import { DialogContext } from "../pages/Tasks";

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
  const { setOpenDialog }: any = useContext(DialogContext);

  const createNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

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
            <Button color="secondary" type="submit" label="Ajouter une tâche" />
            <Button
              isLink={true}
              label="Annuler"
              onClick={() => setOpenDialog(false)}
            />
          </form>
        </Modal>
        <Button
          isLink={true}
          icon={<Plus />}
          label="Nouvelle tache"
          onClick={() => setOpenDialog(true)}
        />
        <Button
          isLink={true}
          icon={<Trash2 />}
          color="tertiary"
          label="Supprimer la colonne"
          onClick={() => removeColumn(id)}
        />
      </div>
    </div>
  );
}

export default TasksCol;
