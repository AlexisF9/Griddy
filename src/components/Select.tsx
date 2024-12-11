interface SelectProps extends React.SelectHTMLAttributes<any> {
  label?: string;
  options: { label: string; value: string; selected?: boolean }[];
  id: string;
  name: string;
  required?: boolean;
}

function Select(props: SelectProps) {
  const { label, options, id, name, required, ...rest } = props;
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
          {...rest}
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
