import { CloudUpload, File } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  label,
  text,
}: {
  files: FilesType[];
  setFiles: (e: FilesType[]) => void;
  label: string;
  text: string;
}) {
  const [getFiles, setGetFiles] = useState<FilesType[]>([...files]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    selectedFiles.map(async (el: File) => {
      if (!getFiles.find((file) => file.name === el.name)) {
        try {
          const res = await useTransformBase64(el);
          if (res) {
            const file: FilesType = {
              lastModified: el.lastModified,
              name: el.name,
              size: el.size,
              type: el.type,
              src: res as string,
            };
            setGetFiles((prevFiles) => [...prevFiles, file]);
          }
        } catch (err: any) {
          console.log(err.toString());
        }
      }
    });

    if (inputRef.current) {
      inputRef.current.value = "";
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

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragDrop = () => {
    setIsDragOver(false);
  };

  return (
    <div className="c-files-input">
      <p className="c-files-input__title c-text-m">{label}</p>
      <div
        className={`c-files-input__field ${
          isDragOver && "c-files-input__field--over"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragDrop}
      >
        <label htmlFor="files">
          <CloudUpload /> {text}
        </label>
        <input
          type="file"
          multiple
          accept=".pdf, .doc, .docx, .png, .jpeg, .jpg"
          name="task-files"
          id="files"
          ref={inputRef}
          onChange={(e) => {
            handleFileChange(e);
          }}
        />
      </div>

      <ul className="c-files-input__list">
        {getFiles.map((file, index) => (
          <li key={index}>
            {file.type === "image/jpeg" || file.type === "image/png" ? (
              <img width={24} height={24} src={file.src} />
            ) : (
              <File />
            )}
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
