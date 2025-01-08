import { useLocation } from "react-router";
import Button from "../components/Button";

function NotFound() {
  const location = useLocation();
  console.log(location);
  return (
    <div className="c-not-found">
      <h2 className="c-h-xl u-mb-8">Page introuvable</h2>
      <p className="c-text-l u-mb-24">
        La page{" "}
        <span className="u-fw-800 u-text-orange">{location.pathname}</span>{" "}
        n'existe pas
      </p>
      <Button label="Revenir au dashboard" url="/" />
    </div>
  );
}

export default NotFound;
