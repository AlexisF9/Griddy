import { Navigate } from "react-router";
import Button from "../components/Button";
import { useAppStore } from "../App";
import Field from "../components/Field";

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
          <div className="c-home__card">
            <div className="c-home__card-content">
              <h1 className="u-mb-16">Griddy</h1>
              <p className="c-text-l u-mb-32">
                Entrez votre nom pour continuer
              </p>
              <form className="c-home__form" onSubmit={(e) => handleSubmit(e)}>
                <Field
                  name="name"
                  id="name"
                  required={true}
                  placeholder="Entrez votre nom"
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
