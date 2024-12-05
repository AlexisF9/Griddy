import { useEffect, useState } from "react";
import Button from "../components/Button";

function Tasks() {
  const [newColumn, setNewColumn] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasksList();
  }, []);

  const getTasksList = () => {
    setTasks(
      localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks") ?? "")
        : []
    );
  };

  const createColumn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const oldTasks = localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") ?? "")
      : [];

    if (
      !oldTasks.find((el: { name: string }) => el.name === data.get("name"))
    ) {
      const createCol = {
        name: data.get("name"),
        id: Date.now(),
        cards: [],
      };

      const newTasks = [...oldTasks, createCol];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setNewColumn(false);
      getTasksList();
    } else {
      window.alert("Cette colonne existe déjà");
    }
  };

  const removeColumn = (id: number) => {
    const col = tasks.find((el: { id: number }) => el.id === id);
    if (col) {
      const tasksCopy = [...tasks];
      const index = tasksCopy.indexOf(col);
      tasksCopy.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasksCopy));
      getTasksList();
    }
  };

  return (
    <div className="c-tasks">
      <div className="c-tasks__intro">
        <h2 className="c-h-l u-mb-16">Mes taches</h2>
        {newColumn ? (
          <div className="c-tasks__new-col">
            <form onSubmit={(e) => createColumn(e)}>
              <label htmlFor="name">Nom de la colonne</label>
              <input
                id="name"
                type="text"
                name="name"
                className="c-input"
                required
              />
              <div>
                <Button type="submit" color="secondary" label="Créer" />
                <Button label="Annuler" onClick={() => setNewColumn(false)} />
              </div>
            </form>
          </div>
        ) : (
          <Button
            color="secondary"
            label="Ajouter une colonne"
            onClick={() => setNewColumn(true)}
          />
        )}
      </div>

      <div className="c-table">
        {tasks && tasks.length > 0 ? (
          tasks.map((el: any) => (
            <div className="c-table__col" key={el.id}>
              <p className="c-text-l u-mb-12">{el.name}</p>
              <Button onClick={() => removeColumn(el.id)} label="Supprimer" />
              <div>
                {el.cards.length > 0 &&
                  el.cards.map((card: any) => (
                    <div className="c-table__card" key={card.id}>
                      {card.label}
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p>
            Vous n'avez aucune tache. Crée une colonne pour ajouter une tâche.
          </p>
        )}
      </div>
    </div>
  );
}

export default Tasks;
