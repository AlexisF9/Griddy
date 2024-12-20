import { useState } from "react";
import Button from "../components/Button";
import TasksColumn from "../components/TasksColumn";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Field from "../components/Field";
import { useAppStore } from "../store";
import ToggleButtons from "../components/ToggleButtons";
import { ChevronDown } from "lucide-react";
import { DragDropContext } from "react-beautiful-dnd";

function Tasks() {
  const [newColumn, setNewColumn] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const { setTasks, tasks, moveCard } = useAppStore();

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

      const newTasks = [createCol, ...oldTasks];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setNewColumn(false);
      setTasks();
      toast.success("Une nouvelle colonne à été créé", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } else {
      toast.warning("Une colonne à déjà ce nom", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const removeColumn = (id: number) => {
    const col = tasks.find((el: { id: number }) => el.id === id);
    if (col) {
      const tasksCopy = [...tasks];
      const index = tasksCopy.indexOf(col);
      tasksCopy.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasksCopy));
      setTasks();
      toast.success("Votre colonne a été supprimée", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const status = [
    { label: "Tous", value: "all" },
    { label: "À faire", value: "to-do" },
    { label: "En cours", value: "progress" },
    { label: "En pause", value: "pause" },
    { label: "Terminé", value: "finished" },
  ];

  const changeFormatDate = (date: string) => {
    return date.toString().split("-").reverse().join("/");
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setDateFilter("");
  };

  const filterTasks = (cards: []) => {
    let filteredCards = [...cards];

    if (cards?.length > 0) {
      if (statusFilter !== "" && statusFilter !== "all") {
        filteredCards = filteredCards.filter(
          (el: { status: string }) => el.status === statusFilter
        );
      }

      if (dateFilter !== "") {
        filteredCards = filteredCards.filter(
          (el: { date: string }) =>
            changeFormatDate(el.date) === changeFormatDate(dateFilter)
        );
      }

      return filteredCards;
    }
    return [];
  };

  const handleTaskDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const fromColId = parseInt(source.droppableId, 10);
    const toColId = parseInt(destination.droppableId, 10);
    const oldIndex = source.index;
    const newIndex = destination.index;

    moveCard(fromColId, toColId, oldIndex, newIndex);
  };

  return (
    <div className="c-tasks">
      <div className="c-tasks__content">
        <div className="c-tasks__intro">
          <h2 className="c-h-xl u-mb-16">Mes taches</h2>
          <ToastContainer />
          {newColumn ? (
            <div className="c-tasks__new-col">
              <form onSubmit={(e) => createColumn(e)}>
                <Field
                  required={true}
                  id="name"
                  name="name"
                  placeholder="Nom de la colonne"
                />
                <div>
                  <Button type="submit" label="Créer" />
                  <Button
                    isLink={true}
                    label="Annuler"
                    onClick={() => setNewColumn(false)}
                  />
                </div>
              </form>
            </div>
          ) : (
            <Button
              label="Ajouter une colonne"
              onClick={() => setNewColumn(true)}
            />
          )}
        </div>

        {tasks && tasks.length > 0 ? (
          <>
            {tasks.filter((el) => el.cards?.length > 0)?.length > 0 && (
              <div
                className={`c-tasks__filters${
                  openFilters ? " c-tasks__filters--open" : ""
                }`}
              >
                <div
                  className="c-tasks__filters-intro"
                  onClick={() => setOpenFilters((el) => !el)}
                >
                  <h3 className="c-text-l">Filtres</h3>
                  <ChevronDown className="u-text-default" />
                </div>
                <div className="c-tasks__filters-content">
                  <div>
                    <div className="c-field">
                      <p className="c-text-m">Trier par statut</p>
                      <ToggleButtons
                        name="tasks-status"
                        list={status}
                        state={statusFilter}
                        updateState={setStatusFilter}
                      />
                    </div>
                    <Field
                      id="sortByDate"
                      name="sortByDate"
                      label="Trier par date"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  <Button
                    color="warning"
                    isLink
                    label="Réinitialiser les filtres"
                    onClick={resetFilters}
                  />
                </div>
              </div>
            )}

            <DragDropContext onDragEnd={handleTaskDragEnd}>
              <div className="c-tasks-column">
                {tasks?.map((col: any) => (
                  <TasksColumn
                    key={col.id}
                    //draggable={tasks.length > 1 ? true : false}
                    id={col.id}
                    name={col.name}
                    cards={filterTasks(col.cards)}
                    removeColumn={removeColumn}
                  />
                ))}
              </div>
            </DragDropContext>
          </>
        ) : (
          <p>
            Vous n'avez pas de tâches. Crée une colonne pour ajouter une
            nouvelle tâche.
          </p>
        )}
      </div>
    </div>
  );
}

export default Tasks;
