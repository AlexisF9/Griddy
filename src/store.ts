import { create } from "zustand";

export const useAppStore = create<{
    isAuth: boolean;
    name: null | string;
    toggleAuth: any;
    changeName: any;
  }>()((set) => ({
    isAuth: localStorage.getItem("name") ? true : false,
    name: localStorage.getItem("name")
      ? JSON.parse(localStorage.getItem("name") ?? "")
      : null,
    toggleAuth: (elem: boolean) => set(() => ({ isAuth: elem })),
    changeName: (elem: string | null) => set(() => ({ name: elem })),
}));