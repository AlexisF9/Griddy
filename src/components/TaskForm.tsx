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
    cover: any;
  };
}) {
  const [inputs, setInputs] = useState({
    label: task ? task.label : "",
    description: task ? task.description : "",
    date: task ? task.date : "",
    priority: task ? task.priority : "",
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
    if (inputs.cover) {
      fetchPicture(inputs.cover);
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

  const getPicture = async (file: File) => {
    let picture = null;

    try {
      const res = await getBase64(file);
      picture = res;
    } catch (err: any) {
      console.log(err.toString());
    }

    setInputs({
      ...inputs,
      cover: picture,
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
