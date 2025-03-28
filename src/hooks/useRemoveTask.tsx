import { Bounce, toast } from "react-toastify";

export const useRemoveTask = (
  tasks: any[],
  cardId: number | null,
  colId: number | null
) => {
  if (tasks && tasks.length > 0 && cardId && colId) {
    const arr = [...tasks];
    const col = arr.find((el: { id: number }) => el.id === colId);
    const colIndex = arr.indexOf(col);

    const card = col.cards.find((el: any) => el.id === cardId);
    const cardIndex = col.cards.indexOf(card);

    col.cards.splice(cardIndex, 1);

    arr[colIndex].cards = [...col.cards];

    localStorage.setItem("tasks", JSON.stringify(arr));

    toast.success("Votre tâche a été supprimée", {
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
