import { Check, GripVertical, Pen, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import TaskCard from "./TaskCard";
import Field from "./Field";
import TaskForm from "./TaskForm";
import { useAppStore } from "../store";
import { Bounce, toast } from "react-toastify";
import { Draggable, Droppable } from "react-beautiful-dnd";

function TasksColumn({
  id,
  name,
  cards,
  draggable = false,
  removeColumn,
}: {
  id: number;
  name: string;
  cards: { status: string }[];
  draggable?: boolean;
  removeColumn: (e: any) => void;
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

    let picture = null;
    const taskCover = data.get("task-cover") as {
      name: string;
      type: string;
      size: number;
      lastModified: number;
    };

    if (taskCover?.name && taskCover.size > 0) {
      try {
        picture = await getBase64(taskCover);
      } catch (err) {
        toast.error("Une erreur est survenue lors du chargement de l'image", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          transition: Bounce,
        });
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
            name: taskCover.name,
            type: taskCover.type,
            lastModified: taskCover.lastModified,
          }
        : {},
      id: Date.now(),
    };

    arr[index].cards = [newTask, ...col.cards];
    localStorage.setItem("tasks", JSON.stringify(arr));
    setOpenDialog(false);
    setTasks();
    toast.success("Une nouvelle tâche a été créée", {
      position: "bottom-right",
      autoClose: 5000,
      theme: "colored",
      transition: Bounce,
    });
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
              color="light"
              label="Modifier"
              onClick={toggleEditCol}
            />
            <Button
              isLink={true}
              icon={<Trash2 />}
              color="warning"
              label="Supprimer"
              onClick={() => removeColumn(id)}
            />
          </div>
        </Dropdown>
      </div>
      <Droppable key={id} droppableId={String(id)}>
        {(provided: any) => {
          const { innerRef, droppableProps, placeholder } = provided || {};

          return (
            <div ref={innerRef} {...droppableProps}>
              <div className="c-tasks-column__cards u-mb-24">
                {cards?.length > 0 &&
                  cards.map((card: any, index: any) => (
                    <Draggable
                      key={card.id}
                      draggableId={String(card.id)}
                      index={index}
                    >
                      {(provided: any) => {
                        const { innerRef, draggableProps, dragHandleProps } =
                          provided || {};
                        return (
                          <div
                            ref={innerRef}
                            {...draggableProps}
                            {...dragHandleProps}
                          >
                            <TaskCard card={card} colId={id} />
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                {placeholder}
              </div>
              <div className="c-tasks-column__new-task">
                <Modal open={openDialog} setOpen={setOpenDialog}>
                  <p className="c-h-l u-mb-16">
                    Création d'une tâche dans : {name}
                  </p>
                  <form
                    className="c-tasks-column__new-task-form"
                    onSubmit={(e) => createNewTask(e, id)}
                  >
                    <TaskForm />
                    <div className="c-tasks-column__new-task-action">
                      <p className="c-text-s u-mb-12">*Champs obligatoire</p>
                      <div>
                        <Button type="submit" label="Ajouter une tâche" />
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
        }}
      </Droppable>
    </div>
  );
}

export default TasksColumn;
