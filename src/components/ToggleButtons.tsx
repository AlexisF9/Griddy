function ToggleButtons({
  list,
  name,
  updateState,
}: {
  list: { label: string; value: string; checked?: boolean }[];
  name: string;
  updateState: React.Dispatch<React.SetStateAction<string>>;
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
          {item.checked ? (
            <input
              {...parameters(item)}
              onChange={(e) => updateState(e.target.value)}
              defaultChecked
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
