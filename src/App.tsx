import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
