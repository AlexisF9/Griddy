import { CloudUpload, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useTransformBase64 } from "../hooks/useTransformBase64";

export interface FilesType {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  src: string;
}

function FilesInput({
  files,
  setFiles,
}: {
  files: FilesType[];
  setFiles: (e: FilesType[]) => void;
}) {
  const [getFiles, setGetFiles] = useState<FilesType[]>([...files]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    //setGetFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    try {
      const res = await useTransformBase64(selectedFiles[0]);
      if (res) {
        const file: FilesType = {
          lastModified: selectedFiles[0].lastModified,
          name: selectedFiles[0].name,
          size: selectedFiles[0].size,
          type: selectedFiles[0].type,
          src: res as string,
        };
        setGetFiles((prevFiles) => [...prevFiles, file]);
      }
    } catch (err: any) {
      console.log(err.toString());
    }
  };

  useEffect(() => {
    setFiles(getFiles);
  }, [getFiles]);

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    const copyFiles = Array.from(getFiles);
    copyFiles.splice(index, 1);
    setGetFiles(copyFiles);
  };

  return (
    <div className="c-files-input">
      <p className="c-files-input__title c-text-m">Fichiers</p>
      <div className="c-files-input__field">
        <label htmlFor="files">
          <CloudUpload /> Ajouter un fichier
        </label>
        <input
          type="file"
          multiple
          accept=".pdf, .doc, .docx, .png, .jpeg, .jpg"
          name="task-files"
          id="files"
          onChange={(e) => {
            handleFileChange(e);
          }}
        />
      </div>

      <ul className="c-files-input__list">
        {getFiles.map((file, index) => (
          <li key={index}>
            <Paperclip />
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
            <Button
              isLink
              color="warning"
              onClick={(e) => handleRemoveFile(e, index)}
              label="Supprimer"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilesInput;
