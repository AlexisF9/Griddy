import { useState, useEffect, useRef } from "react";
import Button from "./Button";

const Chrono = ({
  editTaskPastTime,
}: {
  editTaskPastTime: (t: number) => void;
}) => {
  const [time, setTime] = useState(0); // Temps en millisecondes
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<any>(null);

  useEffect(() => {
    let timer = 0;
    if (isRunning) {
      const startTimestamp = Date.now() - time;
      startTimeRef.current = startTimestamp;

      timer = setInterval(() => {
        setTime(Date.now() - startTimestamp);
      }, 10);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    editTaskPastTime(time);
    handleReset();
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    if (isRunning) {
      const now = Date.now();
      startTimeRef.current = now;
    }
  };

  const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 60000) % 60);
    const hours = Math.floor(time / 3600000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="c-chrono">
      <p className="c-text-l">Chronomètre</p>
      {time > 0 && <p className="c-text-l">{formatTime(time)}</p>}
      <div className="c-chrono__actions">
        {!isRunning ? (
          <Button onClick={handleStart} label="Démarrer" />
        ) : (
          <Button onClick={handlePause} label="Pause" />
        )}
        {time > 0 && (
          <>
            <Button color="warning" onClick={handleStop} label="Arrêter" />
            <Button isLink onClick={handleReset} label="Reset" />
          </>
        )}
      </div>
    </div>
  );
};

export default Chrono;
