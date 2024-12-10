function Priority({
  priority,
}: {
  priority: "normal" | "low" | "high" | "top";
}) {
  const getPriorityLabel = () => {
    return priority === "top"
      ? "Priorité urgente"
      : priority === "low"
      ? "Priorité basse"
      : priority === "high"
      ? "Priorité haute"
      : "Priorité normale";
  };

  return (
    <>
      <p className={`c-priority c-priority--${priority ?? "normal"} c-text-s`}>
        {getPriorityLabel()}
      </p>
    </>
  );
}

export default Priority;
