function Select({
  label,
  options,
  id,
  name,
  required,
}: {
  label?: string;
  options: { label: string; value: string; selected?: boolean }[];
  id: string;
  name: string;
  required?: boolean;
}) {
  return (
    <>
      <div className="c-select">
        <label htmlFor={id}>
          {label}
          {required && <span>*</span>}
        </label>

        <select
          className="c-field__input"
          name={name}
          id={id}
          required={required ?? false}
          defaultValue={options.find((el) => el.selected)?.value ?? ""}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default Select;
