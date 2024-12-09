import { Check, GripVertical, Pen, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import React, { useContext, useEffect, useState } from "react";
import { DialogContext } from "../pages/Tasks";
import Dropdown from "./Dropdown";

function TasksCol({
  id,
  name,
  cards,
  draggable,
  removeColumn,
  getTasksList,
}: {
  id: number;
  name: string;
  cards: { label: string }[];
  draggable: boolean;
  removeColumn: (e: any) => void;
  getTasksList: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [editColName, setEditColName] = useState(false);
  const [colName, setColName] = useState(name);

  const changeNameRef = React.useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    let handler = (e: any) => {
      if (changeNameRef.current && !changeNameRef.current.contains(e.target)) {
        setEditColName(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { setOpenDialog }: any = useContext(DialogContext);

  const createNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const toggleEditCol = () => {
    setEditColName(true);
    setOpenDropdown(false);
  };

  const handleEditColName = (
    e: React.FormEvent<HTMLFormElement>,
    id: number
  ) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const arr = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") ?? "")
      : [];
    const col = arr.find((el: { id: number }) => el.id === id);

    if (col.name !== data.get("col-name")) {
      const index = arr.indexOf(col);
      arr[index].name = data.get("col-name");
      localStorage.setItem("tasks", JSON.stringify(arr));
      getTasksList();
    }

    setEditColName(false);
  };

  return (
    <div className="c-table__col">
      <div className="c-table__col-intro u-mb-12">
        <div className="c-table__col-intro-content">
          {draggable && (
            <span className="c-table__col-drag">
              <GripVertical />
            </span>
          )}
          {editColName ? (
            <form
              className="c-table__col-edit-name"
              ref={changeNameRef}
              onSubmit={(e) => handleEditColName(e, id)}
            >
              <input
                className="c-input"
                name="col-name"
                value={colName}
                onChange={(e) => setColName(e.target.value)}
                type="text"
              />
              <Button isLink={true} type="submit" icon={<Check />} label="" />
            </form>
          ) : (
            <p className="c-text-l">{name}</p>
          )}
        </div>
        <Dropdown setOpen={setOpenDropdown} open={openDropdown}>
          <div className="c-table__col-action">
            <Button
              isLink={true}
              icon={<Pen />}
              label="Modifier"
              onClick={toggleEditCol}
            />
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
