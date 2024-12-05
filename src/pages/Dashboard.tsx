import { useAppStore } from "../App";

function Dashboard() {
  const { name } = useAppStore();
  const user = name ?? "";

  return (
    <div className="c-dashboard">
      <h2 className="c-dashboard__title">
        Bienvenue sur ton board <span>{user}</span>
      </h2>
      <h3>Statistiques</h3>
    </div>
  );
}

export default Dashboard;
