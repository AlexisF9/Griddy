import { useState } from "react";
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
  };
}) {
  const [inputs, setInputs] = useState({
    label: task ? task.label : "",
    description: task ? task.description : "",
    date: task ? task.date : "",
    priority: task ? task.priority : "",
  });

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
    </>
  );
}

export default TaskForm;
