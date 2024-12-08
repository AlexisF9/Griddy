import { Navigate } from "react-router";
import Button from "../components/Button";
import { useAppStore } from "../App";

function Home() {
  const { isAuth, toggleAuth, changeName } = useAppStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    localStorage.setItem("name", JSON.stringify(data.get("name")));

    toggleAuth(true);
    const user = localStorage.getItem("name") ?? null;
    changeName(user ? JSON.parse(user) : null);
  };

  return (
    <>
      {isAuth ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <div className="c-home">
          <h1>Griddy</h1>
          <div className="c-home__card">
            <div className="c-home__card-content">
              <h2 className="c-h-xl u-mb-8">Bienvenue</h2>
              <p className="c-text-l u-mb-24">
                Entrer votre nom pour commencer à utiliser Griddy
              </p>
              <form className="c-home__form" onSubmit={(e) => handleSubmit(e)}>
                <label className="c-text-m u-mb-8" htmlFor="name">
                  Quel est ton prénom ?
                </label>
                <input
                  id="name"
                  className="c-input u-mb-16"
                  type="text"
                  name="name"
                  required
                />
                <Button
                  fullWidth={true}
                  color="secondary"
                  label="Commencer"
                  type="submit"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
