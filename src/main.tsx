import { createRoot } from "react-dom/client";
import "./assets/styles/style.scss";
import App from "./App.tsx";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

createRoot(document.getElementById("root")!).render(<App />);
