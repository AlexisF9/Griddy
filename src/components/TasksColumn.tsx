import { Check, GripVertical, Pen, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import TaskCard from "./TaskCard";
import Field from "./Field";
import TaskForm, { FilesType } from "./TaskForm";
import { useAppStore } from "../store";
import { Bounce, toast } from "react-toastify";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { useTransformBase64 } from "../hooks/useTransformBase64";

function TasksColumn({
  id,
  name,
  cards,
  removeColumn,
  isMobile,
}: {
  id: number;
  name: string;
  cards: { status: string }[];
  removeColumn: (id: number) => void;
  isMobile?: boolean;
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

  const base64 = async (element: File) => {
    try {
      const res = await useTransformBase64(element);
      if (res) {
        const file: FilesType = {
          lastModified: element.lastModified,
          name: element.name,
          size: element.size,
          type: element.type,
          src: res as string,
        };

        return file;
      }
    } catch (err) {
      toast.error("Une erreur est survenue lors du chargement de l'image", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
    }
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

    const form = e.target as HTMLFormElement;
    const taskCover = (
      form.elements.namedItem("task-cover") as HTMLInputElement
    ).files?.[0];

    const taskFilesPromises = Array.from(
      (form.elements.namedItem("task-files") as HTMLInputElement)
        .files as FileList
    ).map((el) => base64(el));

    const taskFiles = await Promise.all(taskFilesPromises);

    const newTask = {
      label: data.get("task-label"),
      description: data.get("task-desc") ?? "",
      date: data.get("task-date") ?? "",
      priority: data.get("task-priority"),
      status: data.get("task-status"),
      maxTime: data.get("task-max-time"),
      time: 0,
      cover: taskCover ? await base64(taskCover) : null,
      id: Date.now(),
      files: taskFiles,
    };

    arr[index].cards = [newTask, ...col.cards];

    try {
      localStorage.setItem("tasks", JSON.stringify(arr));
      setOpenDialog(false);
      setTasks();
      toast.success("Une nouvelle tâche a été créée", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
    } catch (err) {
      toast.error("Vous avez atteint la limite de place du local storage", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
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
          {!isMobile && tasks.length > 1 && (
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
            <h3 className="c-text-l">
              {name}
              {cards.length > 0 && (
                <span className="c-text-m c-tasks-column__tag">
                  {cards.length}
                </span>
              )}
            </h3>
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
      <Droppable droppableId={String(id)} type="TASK">
        {(provided: DroppableProvided) => {
          const { innerRef, droppableProps, placeholder } = provided || {};

          return (
            <div ref={innerRef} {...droppableProps}>
              <div className="c-tasks-column__cards u-mb-24">
                {cards?.length > 0 &&
                  cards.map((card: any, index: number) => (
                    <Draggable
                      key={card.id}
                      draggableId={String(card.id)}
                      index={index}
                      isDragDisabled={
                        tasks.length < 2 &&
                        tasks.reduce(
                          (total, column) => total + column.cards.length,
                          0
                        ) < 2
                          ? true
                          : false
                      }
                    >
                      {(provided: DraggableProvided) => {
                        const { innerRef, draggableProps, dragHandleProps } =
                          provided || {};
                        return (
                          <div
                            ref={innerRef}
                            {...draggableProps}
                            {...dragHandleProps}
                          >
                            <TaskCard
                              card={card}
                              colId={id}
                              disabledDrag={
                                tasks.length < 2 &&
                                tasks.reduce(
                                  (total, column) =>
                                    total + column.cards.length,
                                  0
                                ) < 2
                                  ? true
                                  : false
                              }
                            />
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
