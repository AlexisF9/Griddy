import { FilesType } from "../components/TaskForm";
import { useTransformBase64 } from "./useTransformBase64";

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
    console.log(err);
  }
};

export const useEditTask = async (
  e: React.FormEvent<HTMLFormElement>,
  task: any,
  colId: number,
  tasks: any
) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);

  const form = e.target as HTMLFormElement;
  const taskCover = (form.elements.namedItem("task-cover") as HTMLInputElement)
    .files?.[0];

  const currentCover = task?.cover || null;
  const isSameCover =
    currentCover &&
    taskCover?.name === currentCover.name &&
    taskCover?.lastModified === currentCover.lastModified;

  const taskFilesPromises = Array.from(
    (form.elements.namedItem("task-files") as HTMLInputElement)
      .files as FileList
  ).map((el) => base64(el));

  const taskFiles = await Promise.all(taskFilesPromises);

  const editedTask = {
    ...task,
    label: data.get("task-label"),
    description: data.get("task-desc") || "",
    date: data.get("task-date") || "",
    priority: data.get("task-priority"),
    status: data.get("task-status"),
    files: taskFiles,
    cover: isSameCover
      ? currentCover
      : taskCover
      ? await base64(taskCover)
      : null,
  };

  const arr = [...tasks];
  const col = arr.find((el) => el.id === colId);
  if (!col) return;

  const cardIndex = col.cards.findIndex(
    (el: { id: number }) => el.id === task.id
  );
  if (cardIndex === -1) return;

  col.cards[cardIndex] = { ...editedTask, id: task.id };
  localStorage.setItem("tasks", JSON.stringify(arr));
};
