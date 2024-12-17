import { forwardRef } from "react";

interface FieldProps extends React.InputHTMLAttributes<any> {
  label?: string;
  type?: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  color?: string;
}

const Field = forwardRef(function MyInput(
  props: FieldProps,
  ref: React.ForwardedRef<any>
) {
  const {
    label,
    type,
    id,
    name,
    placeholder,
    required,
    isTextarea,
    color,
    ...rest
  } = props;

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
          <input type={type ?? "text"} {...parameters} {...rest} ref={ref} />
        )}
      </div>
    </>
  );
});

export default Field;
