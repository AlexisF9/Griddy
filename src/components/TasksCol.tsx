import { GripVertical, Pen, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import { useContext } from "react";
import { DialogContext } from "../pages/Tasks";
import Dropdown from "./Dropdown";

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
        <div className="c-table__col-intro-content">
          {draggable && <GripVertical />}
          <p className="c-text-l">{name}</p>
        </div>
        <Dropdown>
          <div className="c-table__col-action">
            <Button isLink={true} icon={<Pen />} label="Modifier" />
            <Button
              isLink={true}
              icon={<Trash2 />}
              color="tertiary"
              label="Supprimer"
              onClick={() => removeColumn(id)}
            />
          </div>
        </Dropdown>
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
      <div className="c-table__new-task">
        <Modal>
          <p className="c-h-l u-mb-16">Créé une tâche dans {name}</p>
          <form
            className="c-table__new-task-form"
            onSubmit={(e) => createNewTask(e)}
          >
            <input
              required
              className="c-input"
              name="label"
              id="label"
              placeholder="Nom de la tache"
            />
            <div>
              <Button
                color="secondary"
                type="submit"
                label="Ajouter une tâche"
              />
              <Button
                isLink={true}
                label="Annuler"
                onClick={() => setOpenDialog(false)}
              />
            </div>
          </form>
        </Modal>
        <Button
          isLink={true}
          icon={<Plus />}
          label="Nouvelle tache"
          onClick={() => setOpenDialog(true)}
        />
      </div>
    </div>
  );
}

export default TasksCol;
