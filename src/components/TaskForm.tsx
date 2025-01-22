import { useEffect, useRef, useState } from "react";
import Field from "./Field";
import Select from "./Select";
import FilesField from "./FilesField";

export interface FilesType {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  src: string;
}

function TaskForm({
  task,
  edit,
}: {
  task?: {
    label: string;
    description: string;
    date: string;
    priority: string;
    status: string;
    cover?: FilesType;
    files?: FilesType[];
  };
  edit?: boolean;
}) {
  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [inputs, setInputs] = useState({
    label: task ? task.label : "",
    description: task ? task.description : "",
    date: task ? task.date : getTodayDate(),
    priority: task ? task.priority : "",
    status: task ? task.status : "",
    cover: task ? task.cover : null,
    files: task ? task.files : [],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<HTMLInputElement>(null);

  const fetchFile = async (file: FilesType) => {
    try {
      const res = await fetch(file.src);
      const blob = await res.blob();
      const data = new DataTransfer();
      data.items.add(
        new File([blob], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        })
      );
      if (inputRef.current) {
        inputRef.current.files = data.files;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFiles = async (files: FilesType[]) => {
    try {
      const filePromises = files.map(async (el: FilesType) => {
        const res = await fetch(el.src);
        const blob = await res.blob();
        return new File([blob], el.name, {
          type: el.type,
          lastModified: el.lastModified,
        });
      });

      const fileArray = await Promise.all(filePromises);

      const dataTransfer = new DataTransfer();
      fileArray.forEach((file) => dataTransfer.items.add(file));

      if (filesRef.current) {
        filesRef.current.files = dataTransfer.files;
      }
    } catch (err) {
      console.error("Erreur lors de la conversion des fichiers :", err);
    }
  };

  useEffect(() => {
    if (inputs?.cover && inputs.cover?.name) {
      fetchFile(inputs.cover);
    }

    if (inputs.files && inputs.files.length > 0) {
      fetchFiles(inputs.files);
    }
  }, []);

  const defaultStatus = [
    { label: "À faire", value: "to-do" },
    { label: "En cours", value: "progress" },
    { label: "En pause", value: "pause" },
  ];

  return (
    <>
      <Field
        label="Nom de la tâche"
        required={true}
        name="task-label"
        id="label"
        value={inputs.label}
        onChange={(e) =>
          setInputs({
            ...inputs,
            label: e.target.value,
          })
        }
      />
      <Field
        label="Déscription"
        name="task-desc"
        id="desc"
        isTextarea={true}
        value={inputs.description}
        onChange={(e) =>
          setInputs({
            ...inputs,
            description: e.target.value,
          })
        }
      />
      <div className="c-field__group">
        <Field
          label="Date d'échéance"
          name="task-date"
          id="date"
          type="date"
          required={true}
          value={inputs.date}
          onChange={(e) =>
            setInputs({
              ...inputs,
              date: e.target.value,
            })
          }
        />
        <Select
          required={true}
          options={[
            { label: "Faible", value: "low" },
            { label: "Normal", value: "normal" },
            { label: "Haute", value: "high" },
            { label: "Urgent", value: "top" },
          ]}
          label="Priorité"
          id="priority"
          name="task-priority"
          defaultValue={inputs.priority}
          onChange={(e) =>
            setInputs({
              ...inputs,
              priority: e.target.value,
            })
          }
        />
      </div>
      <Select
        required={true}
        options={
          edit
            ? [...defaultStatus, { label: "Terminé", value: "finished" }]
            : [...defaultStatus]
        }
        label="Statut"
        id="status"
        name="task-status"
        defaultValue={inputs.status}
        onChange={(e) =>
          setInputs({
            ...inputs,
            status: e.target.value,
          })
        }
      />

      <FilesField
        label="Image de couverture"
        text="Ajouter une image"
        accept=".jpg, .jpeg, .png"
        name="task-cover"
        id="cover"
        files={task?.cover ? [task.cover] : []}
        inputRef={inputRef}
      />

      <FilesField
        label="Fichiers"
        text="Ajouter un fichier"
        accept=".pdf, .doc, .docx, .jpeg, .jpg, .png"
        multiple
        name="task-files"
        id="files"
        files={task?.files ? [...task.files] : []}
        inputRef={filesRef}
      />
    </>
  );
}

export default TaskForm;
