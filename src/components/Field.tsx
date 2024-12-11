interface FieldProps extends React.InputHTMLAttributes<any> {
  label?: string;
  type?: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
}

function Field(props: FieldProps) {
  const { label, type, id, name, placeholder, required, isTextarea, ...rest } =
    props;

  const parameters = {
    required: required,
    name: name,
    id: id,
    placeholder: placeholder,
    className: "c-field__input",
  };

  return (
    <>
      <div className="c-field">
        {label && (
          <label className="c-text-m" htmlFor={id}>
            {label}
            {required && <span>*</span>}
          </label>
        )}
        {isTextarea ? (
          <textarea {...parameters} {...rest} />
        ) : (
          <input type={type ?? "text"} {...parameters} {...rest} />
        )}
      </div>
    </>
  );
}

export default Field;
