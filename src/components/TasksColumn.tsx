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
  statusFilter,
}: {
  id: number;
  name: string;
  cards: { status: string }[];
  draggable: boolean;
  removeColumn: (e: any) => void;
  statusFilter: string | null;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [editColName, setEditColName] = useState(false);
  const [colName, setColName] = useState(name);

  const { tasks, setTasks } = useAppStore();

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
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
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
    const arr = [...tasks];
    const col = arr.find((el: { id: number }) => el.id === id);
    const index = arr.indexOf(col);

    if (
      col.cards.length === 0 ||
      !col.cards.find(
        (el: { label: string }) => el.label === data.get("task-label")
      )
    ) {
      let picture = null;

      if (
        (data.get("task-cover") as { name: string }).name !== "" &&
        (data.get("task-cover") as { size: number }).size > 0
      ) {
        try {
          const res = await getBase64(data.get("task-cover"));
          picture = res;
        } catch (err) {
          console.log(err);
        }
      }

      const newTask = {
        label: data.get("task-label"),
        description: data.get("task-desc") ?? "",
        date: data.get("task-date") ?? "",
        priority: data.get("task-priority"),
        status: data.get("task-status"),
        cover: picture
          ? {
              url: picture,
              name: (data.get("task-cover") as { name: string }).name,
              type: (data.get("task-cover") as { type: string }).type,
              lastModified: (data.get("task-cover") as { lastModified: number })
                .lastModified,
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
              <Button
                color="secondary"
                isLink={true}
                type="submit"
                icon={<Check />}
                label=""
              />
            </form>
          ) : (
            <h3 className="c-text-l">{name}</h3>
          )}
        </div>
        <Dropdown setOpen={setOpenDropdown} open={openDropdown}>
          <div className="c-tasks-column__col-action">
            <Button
              isLink={true}
              icon={<Pen />}
              color="primary"
              label="Modifier"
              onClick={toggleEditCol}
            />
            <Button
              isLink={true}
              icon={<Trash2 />}
              color="white"
              label="Supprimer"
              onClick={() => removeColumn(id)}
            />
          </div>
        </Dropdown>
      </div>

      {cards && cards.length > 0 && (
        <div className="c-tasks-column__cards u-mb-24">
          {statusFilter !== "" && statusFilter !== "all"
            ? cards
                .filter((el: { status: string }) => el.status === statusFilter)
                .map((card: any) => (
                  <TaskCard key={card.id} card={card} colId={id} />
                ))
            : cards.map((card: any) => (
                <TaskCard key={card.id} card={card} colId={id} />
              ))}
        </div>
      )}

      <div className="c-tasks-column__new-task">
        <Modal open={openDialog} setOpen={setOpenDialog}>
          <p className="c-h-l u-mb-16">
            Création d'une tâche dans{" "}
            <span className="u-text-primary">{name}</span>
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
                  color="secondary"
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
          color="secondary"
          icon={<Plus />}
          label="Nouvelle tache"
          onClick={() => setOpenDialog(true)}
        />
      </div>
    </div>
  );
}

export default TasksColumn;
