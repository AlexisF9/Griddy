import { Check, GripVertical, Pen, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import TaskCard from "./TaskCard";
import Field from "./Field";
import TaskForm from "./TaskForm";
import { useAppStore } from "../store";

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

  const { setTasks } = useAppStore();

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

  const getBase64 = async (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };

  const createNewTask = async (
    e: React.FormEvent<HTMLFormElement>,
    id: number
  ) => {
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
      let picture = null;

      await getBase64(data.get("task-cover"))
        .then((res) => (picture = res))
        .catch((err) => console.log(err));

      const newTask = {
        label: data.get("task-label"),
        description: data.get("task-desc") ?? "",
        date: data.get("task-date") ?? "",
        priority: data.get("task-priority"),
        cover:
          (data.get("task-cover") as any).name !== ""
            ? {
                name: (data.get("task-cover") as any).name,
                src: picture,
              }
            : {},
        id: Date.now(),
      };

      const cards = [newTask, ...col.cards];
      arr[index].cards = cards;
      localStorage.setItem("tasks", JSON.stringify(arr));

      setOpenDialog(false);
      setTasks();
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
      setTasks();
    }

    setEditColName(false);
  };

  return (
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
              <Field
                id="name"
                name="col-name"
                value={colName}
                onChange={(e) => setColName(e.target.value)}
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
        <Modal open={openDialog} setOpen={setOpenDialog}>
          <p className="c-h-l u-mb-16">
            Création d'une tâche dans{" "}
            <span className="u-text-tertiary">{name}</span>
          </p>
          <form
            className="c-tasks-column__new-task-form"
            onSubmit={(e) => createNewTask(e, id)}
          >
            <TaskForm />
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
  );
}

export default TasksColumn;
