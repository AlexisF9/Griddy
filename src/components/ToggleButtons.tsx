function ToggleButtons({
  list,
  name,
  updateState,
  state,
}: {
  list: { label: string; value: string; checked?: boolean }[];
  name: string;
  updateState: React.Dispatch<React.SetStateAction<string>>;
  state: string;
}) {
  const parameters = (item: { value: string }) => {
    return {
      type: "radio",
      id: "item-" + item.value,
      name: name,
      value: item.value,
    };
  };

  return (
    <div className="c-toggle-buttons">
      {list.map((item, index) => (
        <div key={index} className="c-toggle-buttons__button">
          {item.value === state ? (
            <input
              {...parameters(item)}
              onChange={(e) => updateState(e.target.value)}
              checked
            />
          ) : (
            <input
              {...parameters(item)}
              onChange={(e) => updateState(e.target.value)}
            />
          )}
          <label htmlFor={`item-${item.value}`}>{item.label}</label>
        </div>
      ))}
    </div>
  );
}

export default ToggleButtons;
