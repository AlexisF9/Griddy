import { CloudUpload, Paperclip } from "lucide-react";
import { useState } from "react";
import { FilesType } from "./TaskForm";
import { useTransformBase64 } from "../hooks/useTransformBase64";
import Button from "./Button";

function FilesField({
  label,
  text,
  name,
  id,
  accept,
  multiple,
  files,
  inputRef,
}: {
  label: string;
  text: string;
  name: string;
  id: string;
  accept: string;
  multiple?: boolean;
  files: FilesType[];
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const [filesList, setFilesList] = useState<(FilesType | undefined)[]>(files);
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

  const base64 = async (element: File) => {
    try {
      const res = await useTransformBase64(element);
      if (res) {
        const file: FilesType = {
          lastModified: element.lastModified,
          name: element.name,
          size: element.size,
          type: element.type,
          src: res as string,
        };

        return file;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFiles = async (files: (FilesType | undefined)[]) => {
    try {
      const filePromises = files.map(async (el: FilesType | undefined) => {
        if (el) {
          const res = await fetch(el.src);
          const blob = await res.blob();
          return new File([blob], el.name, {
            type: el.type,
            lastModified: el.lastModified,
          });
        }
      });

      const fileArray = await Promise.all(filePromises);

      const dataTransfer = new DataTransfer();
      fileArray.forEach((file) => file && dataTransfer.items.add(file));

      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files;
      }
    } catch (err) {
      console.error("Erreur lors de la conversion des fichiers :", err);
    }
  };

  const getPreview = async (files: FileList | null) => {
    if (files && files?.length > 0) {
      const previewFilesPromises = Array.from(files).map((el) => base64(el));
      const prev = await Promise.all(previewFilesPromises);
      setFilesList(prev);
    } else {
      setFilesList([]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFilesList = filesList.filter((_, i) => i !== index);
    setFilesList(updatedFilesList);
    fetchFiles(updatedFilesList);
  };

  return (
    <div className="c-files-field">
      <p className="c-files-field__title c-text-m">{label}</p>
      <div
        className={`c-files-field__field ${
          isDragOver && "c-files-field__field--over"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragDrop}
      >
        <label htmlFor={id}>
          <CloudUpload /> {text}
        </label>
        <input
          type="file"
          multiple={multiple ?? false}
          accept={accept}
          name={name}
          id={id}
          ref={inputRef}
          onChange={(e) => getPreview(e.target.files)}
        />
      </div>
      <p className="c-text-s c-files-field__accept">
        Fichiers acceptés : {accept}
      </p>
      {filesList?.length > 0 && (
        <ul className="c-files-field__list">
          {filesList.map((el: FilesType | undefined, index: number) => {
            return (
              el && (
                <li key={index}>
                  {el.type === "image/jpeg" || el.type === "image/png" ? (
                    <img src={el.src} />
                  ) : (
                    <Paperclip />
                  )}
                  <p>{el.name}</p>
                  <Button
                    type="button"
                    label="Supprimer"
                    isLink
                    color="warning"
                    onClick={() => removeFile(index)}
                  />
                </li>
              )
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FilesField;
