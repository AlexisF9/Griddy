import { useEffect, useRef, useState } from "react";
import Field from "./Field";
import Select from "./Select";
import { useTransformBase64 } from "../hooks/useTransformBase64";

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
    cover: any;
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
    cover: task ? task.cover : {},
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPicture = async (url: string) => {
    try {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const data = new DataTransfer();
          data.items.add(
            new File([blob], inputs.cover.name, {
              type: inputs.cover.type,
              lastModified: inputs.cover.lastModified,
            })
          );
          if (inputRef.current !== null) {
            inputRef.current.files = data.files;
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (inputs.cover && inputs.cover.name) {
      fetchPicture(inputs.cover);
    }
  }, []);

  const getPicture = async (file: File) => {
    let picture = null;

    try {
      const res = await useTransformBase64(file);
      picture = res;
    } catch (err: any) {
      console.log(err.toString());
    }

    setInputs({
      ...inputs,
      cover: picture,
    });
  };

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
      <Field
        label="Image de couverture"
        name="task-cover"
        id="cover"
        type="file"
        accept="image/png, image/jpeg"
        ref={inputRef}
        onChange={(e) => {
          getPicture(e.target.files[0]);
        }}
      />
    </>
  );
}

export default TaskForm;
