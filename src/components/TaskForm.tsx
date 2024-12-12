import { useEffect, useRef, useState } from "react";
import Field from "./Field";
import Select from "./Select";

function TaskForm({
  task,
}: {
  task?: {
    label: string;
    description: string;
    date: string;
    priority: string;
    file: any;
  };
}) {
  const [inputs, setInputs] = useState({
    label: task ? task.label : "",
    description: task ? task.description : "",
    date: task ? task.date : "",
    priority: task ? task.priority : "",
    file: task ? task.file : {},
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputs.file.name) {
      const data = new DataTransfer();
      data.items.add(new File([""], inputs.file.name ?? "Ajouter un fichier"));

      if (inputRef.current !== null) {
        inputRef.current.files = data.files;
      }
    }
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

  const getUrlPictue = async (file: File, name: string) => {
    let picture = null;

    try {
      const res = await getBase64(file);
      picture = res;
    } catch (err: any) {
      console.log(err.toString());
    }

    setInputs({
      ...inputs,
      file: {
        name: name,
        src: picture,
      },
    });
  };

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
      <Field
        label="Fichier"
        name="task-file"
        id="file"
        type="file"
        ref={inputRef}
        onChange={(e) =>
          getUrlPictue(e.target.files[0], e.target.files[0].name)
        }
      />
    </>
  );
}

export default TaskForm;
