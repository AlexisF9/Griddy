import { useContext, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import TaskForm, { FilesType } from "./TaskForm";
import { TaskDetailType, TasksContext } from "../pages/Layout";
import {
  Calendar,
  Clock3,
  Eye,
  File,
  FileImage,
  Pen,
  Trash2,
  X,
} from "lucide-react";
import { useRemoveTask } from "../hooks/useRemoveTask";
import Priority from "./Priority";
import { useAppStore } from "../store";
import Tag from "./Tag";
import Chrono from "./Chrono";
import Field from "./Field";
import { useEditTask } from "../hooks/useEditTask";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PdfModal from "./PdfModal";

function TaskInfos() {
  const [openDialog, setOpenDialog] = useState(false);

  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [pdfDialog, setPdfDialog] = useState<string | null>(null);

  const [openPictureDialog, setOpenPictureDialog] = useState(false);
  const [pictureDialog, setPictureDialog] = useState<string | null>(null);

  const [editPastTime, setEditPastTime] = useState(false);

  const { tasks, setTasks } = useAppStore();

  const {
    taskDetail,
    setTaskDetail,
    status,
  }: {
    taskDetail: TaskDetailType;
    setTaskDetail: (e: TaskDetailType) => {};
    status: { label: string; value: string }[];
  } = useContext(TasksContext);

  const getTask = () => {
    if (!tasks?.length || !taskDetail.col || !taskDetail.card) {
      setTaskDetail({ open: false, col: null, card: null });
      return null;
    }

    const col = tasks.find((el) => el.id === taskDetail.col);
    const task = col?.cards?.find(
      (el: { id: number }) => el.id === taskDetail.card
    );

    if (!task) {
      setTaskDetail({ open: false, col: null, card: null });
      return null;
    }

    return task;
  };

  const editTask = async (e: React.FormEvent<HTMLFormElement>) => {
    if (taskDetail?.col) {
      setOpenDialog(false);
      await useEditTask(e, getTask(), taskDetail.col, tasks);
      setTasks();
    }
  };

  const editTaskPastTime = (time: number) => {
    const editedTask = {
      ...getTask(),
      time: time >= 60000 ? time : 0,
    };

    if (taskDetail.col && taskDetail.card) {
      const arr = [...tasks];
      const col = arr.find((el) => el.id === taskDetail.col);
      if (!col) return;

      const cardIndex = col.cards.findIndex(
        (el: { id: number }) => el.id === taskDetail.card
      );
      if (cardIndex === -1) return;

      col.cards[cardIndex] = { ...editedTask, id: taskDetail.card };
      localStorage.setItem("tasks", JSON.stringify(arr));
      setTasks();
    }
  };

  const removeTask = () => {
    if (taskDetail) {
      useRemoveTask(tasks, taskDetail.card, taskDetail.col);
      setTasks();
      closeTaskInfo();
    }
  };

  const closeTaskInfo = () => {
    setTaskDetail({
      open: false,
      col: null,
      card: null,
    });
  };

  const changeFormatDate = (date: string) => {
    return date.toString().split("-").reverse().join("/");
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor((time / 60000) % 60);
    const hours = Math.floor(time / 3600000);
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
      2,
      "0"
    )}m`;
  };

  const timeInputToMilliseconds = (timeValue: string) => {
    if (!timeValue) return 0;
    const [hours, minutes] = timeValue.split(":").map(Number);
    return hours * 3600000 + minutes * 60000;
  };

  const millisecondsToTimeInput = (time: number) => {
    const minutes = Math.floor((time / 60000) % 60);
    const hours = Math.floor(time / 3600000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const handleSubmitEditPastTime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    editTaskPastTime(
      timeInputToMilliseconds(data.get("edit-past-time") as string)
    );
    setEditPastTime(false);
  };

  const handleDownload = (file: FilesType) => {
    const base64ToBlob = (base64: string, contentType: string) => {
      const byteCharacters = atob(base64);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    };

    const base64String = file.src.split(",")[1];
    const blob = base64ToBlob(base64String, file.type);

    return URL.createObjectURL(blob);
  };

  const [numPages, setNumPages] = useState<number>();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <>
      <div
        className={`c-task-infos ${
          taskDetail?.open ? "c-task-infos--open" : ""
        }`}
      >
        <div className="c-task-infos__overlay" onClick={closeTaskInfo}></div>
        <div className="c-task-infos__element">
          <Button
            icon={<X />}
            color="secondary"
            isLink={true}
            onClick={closeTaskInfo}
          />

          {taskDetail.card && taskDetail.col && getTask() && (
            <>
              <div className="c-task-infos__container">
                <div className="c-task-infos__content">
                  {getTask()?.cover?.src && <img src={getTask().cover.src} />}
                  <div className="c-task-infos__intro">
                    <p className="c-h-l">{getTask().label}</p>
                    <Button
                      isLink={true}
                      color="secondary"
                      icon={<Pen />}
                      onClick={() => setOpenDialog(true)}
                    />
                  </div>
                  <div className="c-task-infos__short-infos">
                    <Priority priority={getTask().priority} />
                    {status.find((el) => el.value === getTask().status) && (
                      <Tag
                        label={
                          status.find((el) => el.value === getTask().status)
                            ?.label ?? ""
                        }
                      />
                    )}
                  </div>
                  {(getTask().date || getTask().maxTime) && (
                    <div className="c-task-infos__time-container">
                      {getTask().date && (
                        <p className="c-task-infos__date">
                          <Calendar />
                          {changeFormatDate(getTask().date)}
                        </p>
                      )}
                      {getTask().maxTime && (
                        <p className="c-task-infos__date">
                          <Clock3 /> {formatTime(getTask().maxTime * 3600000)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {getTask().description && (
                  <p className="c-task-infos__description">
                    {getTask().description}
                  </p>
                )}
                <div className="c-task-infos__past-time">
                  {getTask().time > 0 && (
                    <p>
                      Temps passé : {formatTime(getTask().time)}
                      {getTask().maxTime &&
                        " / " + formatTime(getTask().maxTime * 3600000)}
                    </p>
                  )}
                  {getTask().time === 0 ? (
                    <>
                      <Chrono editTaskPastTime={editTaskPastTime} />
                      {!editPastTime && (
                        <Button
                          onClick={() => setEditPastTime((prev) => !prev)}
                          color="ghost"
                          label="Ajouter un temps"
                          icon={<Clock3 />}
                        />
                      )}
                    </>
                  ) : (
                    <div className="c-task-infos__past-time-actions">
                      <Button
                        onClick={() => setEditPastTime((prev) => !prev)}
                        label="Modifier mon temps"
                      />
                      <Button
                        color="warning"
                        onClick={() => editTaskPastTime(0)}
                        isLink
                        icon={<Trash2 />}
                        label="Supprimer"
                      />
                    </div>
                  )}

                  {editPastTime && (
                    <form
                      onSubmit={(e) => handleSubmitEditPastTime(e)}
                      className="c-task-infos__past-time-form"
                    >
                      <Field
                        type="time"
                        id="edit-past-time"
                        name="edit-past-time"
                        defaultValue={millisecondsToTimeInput(getTask().time)}
                      />
                      <div className="c-task-infos__past-time-actions">
                        <Button type="submit" label="Modifier" />
                        <Button
                          onClick={() => setEditPastTime((prev) => !prev)}
                          isLink
                          label="Annuler"
                        />
                      </div>
                    </form>
                  )}
                </div>
                {getTask().files?.length > 0 && (
                  <div className="c-task-infos__files">
                    <p className="u-mb-16">Fichiers :</p>
                    <ul>
                      {getTask().files.map((el: FilesType, index: number) => (
                        <li key={index}>
                          {el.type === "image/jpeg" ||
                          el.type === "image/png" ? (
                            <>
                              <FileImage />
                              <button
                                onClick={() => (
                                  setOpenPictureDialog(true),
                                  setPictureDialog(handleDownload(el))
                                )}
                                className="c-text-s"
                              >
                                <Eye />
                              </button>
                              <a
                                className="c-text-s"
                                href={handleDownload(el)}
                                download={el.name}
                              >
                                {el.name} ({(el.size / 1024).toFixed(2)} KB)
                              </a>
                            </>
                          ) : el.type === "application/pdf" ? (
                            <>
                              <File />
                              <button
                                onClick={() => (
                                  setOpenPdfDialog(true),
                                  setPdfDialog(handleDownload(el))
                                )}
                                className="c-text-s"
                              >
                                <Eye />
                              </button>
                              <a
                                className="c-text-s"
                                href={handleDownload(el)}
                                download={el.name}
                              >
                                {el.name} ({(el.size / 1024).toFixed(2)} KB)
                              </a>
                            </>
                          ) : (
                            <>
                              <File />
                              <a
                                className="c-text-s"
                                href={handleDownload(el)}
                                download={el.name}
                              >
                                {el.name} ({(el.size / 1024).toFixed(2)} KB)
                              </a>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="c-task-infos__remove">
                  <Button
                    isLink={true}
                    icon={<Trash2 />}
                    color="warning"
                    label="Supprimer la tâche"
                    onClick={removeTask}
                  />
                </div>
              </div>
              <Modal open={openDialog} setOpen={setOpenDialog}>
                <p className="c-h-l u-mb-16">
                  Modification de : {getTask().label}
                </p>
                <form
                  className="c-tasks-column__new-task-form"
                  onSubmit={(e) => editTask(e)}
                >
                  <TaskForm task={getTask()} edit={true} />
                  <div className="c-tasks-column__new-task-action">
                    <p className="c-text-s u-mb-12">*Champs obligatoire</p>
                    <div>
                      <Button type="submit" label="Modifier la tâche" />
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

              <Modal open={openPictureDialog} setOpen={setOpenPictureDialog}>
                <img src={`${pictureDialog}`} />
              </Modal>

              <PdfModal open={openPdfDialog} setOpen={setOpenPdfDialog}>
                {pdfDialog && (
                  <>
                    <Document
                      file={pdfDialog}
                      key={pdfDialog}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      {Array.from(new Array(numPages), (_, index) => (
                        <Page
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          width={585}
                          key={index}
                          pageNumber={index + 1}
                        />
                      ))}
                    </Document>
                  </>
                )}
              </PdfModal>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TaskInfos;
