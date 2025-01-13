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
      id: "item-" + name + "-" + item.value,
      name: name,
      value: item.value,
    };
  };

  return (
    <div className="c-toggle-buttons">
      {list.map((item, index) => (
        <div key={index} className="c-toggle-buttons__button">
          <input
            {...parameters(item)}
            checked={item.value === state} // Explicitly manage the `checked` prop
            onChange={(e) => updateState(e.target.value)}
          />
          <label htmlFor={`item-${name}-${item.value}`}>{item.label}</label>
        </div>
      ))}
    </div>
  );
}

export default ToggleButtons;
