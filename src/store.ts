import { create } from "zustand";

export const useAppStore = create<{
    isAuth: boolean;
    name: null | string;
    toggleAuth: (el: boolean) => void;
    changeName: (el: string | null) => void;
    tasks: any[];
    setTasks: () => void;
    moveCard: (fromColId:number, toColId:number, oldIndex:number, newIndex:number) => void
  }>()((set) => ({
    isAuth: localStorage.getItem("name") ? true : false,
    name: localStorage.getItem("name") ? JSON.parse(localStorage.getItem("name") ?? "") : null,
    toggleAuth: (elem: boolean) => set(() => ({ isAuth: elem })),
    changeName: (elem: string | null) => set(() => ({ name: elem })),
    tasks: localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks") ?? "") : [],
    setTasks: () => set(() => ({ tasks: localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks") ?? "") : null })),
    moveCard: (fromColId, toColId, oldIndex, newIndex) =>
      set((state) => {
        const tasks = [...state.tasks];
        const fromCol = tasks.find((col) => col.id === fromColId);
        const toCol = tasks.find((col) => col.id === toColId);
  
        if (!fromCol || !toCol) return { tasks };
  
        const [movedCard] = fromCol.cards.splice(oldIndex, 1);
        toCol.cards.splice(newIndex, 0, movedCard);

        localStorage.setItem("tasks", JSON.stringify(tasks));
  
        return { tasks: tasks };
      }),
}));