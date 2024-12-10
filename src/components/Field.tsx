function Field({
  label,
  type,
  id,
  name,
  placeholder,
  required,
  isTextarea,
}: {
  label?: string;
  type?: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
}) {
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
        <label className="c-text-m" htmlFor={id}>
          {label}
          {required && <span>*</span>}
        </label>
        {isTextarea ? (
          <textarea {...parameters} />
        ) : (
          <input type={type ?? "text"} {...parameters} />
        )}
      </div>
    </>
  );
}

export default Field;
