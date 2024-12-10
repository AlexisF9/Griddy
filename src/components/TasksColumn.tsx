import { Check, GripVertical, Pen, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import React, { createContext, useContext, useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import TaskCard from "./TaskCard";
import { TasksContext } from "../pages/Tasks";
import Field from "./Field";

export const DialogContext: any = createContext(null);

function TasksColumn({
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
  const [openDropdown, setOpenDropdown] = useState(false);
  const [editColName, setEditColName] = useState(false);
  const [colName, setColName] = useState(name);

  const { getTasksList }: { getTasksList: () => void } =
    useContext(TasksContext);

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

  const createNewTask = (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const arr = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") ?? "")
      : [];
    const col = arr.find((el: { id: number }) => el.id === id);
    const index = arr.indexOf(col);

    if (
      col.cards.length === 0 ||
      !col.cards.find(
        (el: { label: string }) => el.label === data.get("task-label")
      )
    ) {
      const newTask = {
        label: data.get("task-label"),
        description: data.get("task-desc") ?? null,
        date: data.get("task-date") ?? null,
        id: Date.now(),
      };

      const cards = [newTask, ...col.cards];
      arr[index].cards = cards;
      localStorage.setItem("tasks", JSON.stringify(arr));

      setOpenDialog(false);
      getTasksList();
    } else {
      window.alert("Cette tâche existe déjà");
    }
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
    <DialogContext.Provider
      value={{
        openDialog,
        setOpenDialog,
      }}
    >
      <div className="c-tasks-column__col">
        <div className="c-tasks-column__col-intro u-mb-24">
          <div className="c-tasks-column__col-intro-content">
            {draggable && (
              <span className="c-tasks-column__col-drag">
                <GripVertical />
              </span>
            )}
            {editColName ? (
              <form
                className="c-tasks-column__col-edit-name"
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
            <div className="c-tasks-column__col-action">
              <Button
                isLink={true}
                icon={<Pen />}
                color="white"
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

        {cards && cards.length > 0 && (
          <div className="c-tasks-column__cards u-mb-24">
            {cards.map((card: any) => (
              <TaskCard key={card.id} card={card} colId={id} />
            ))}
          </div>
        )}

        <div className="c-tasks-column__new-task">
          <Modal>
            <p className="c-h-l u-mb-16">Créé une tâche dans {name}</p>
            <form
              className="c-tasks-column__new-task-form"
              onSubmit={(e) => createNewTask(e, id)}
            >
              <Field
                label="Nom de la tâche"
                required={true}
                name="task-label"
                id="label"
              />
              <Field
                label="Déscription"
                name="task-desc"
                id="desc"
                isTextarea={true}
              />
              <Field
                label="Date d'échéance"
                name="task-date"
                id="date"
                type="date"
              />
              <div className="c-tasks-column__new-task-action">
                <p className="c-text-s u-mb-12">*Champs obligatoire</p>
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
    </DialogContext.Provider>
  );
}

export default TasksColumn;
