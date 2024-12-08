import { Link } from "react-router";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  label: string;
  color?: string;
  url?: string;
  fullWidth?: boolean;
}

function Button(props: ButtonProps) {
  const {
    label,
    fullWidth = false,
    color = "primary",
    url = null,
    ...rest
  } = props;

  const classes = `c-button ${"c-button--" + color} ${
    fullWidth && "c-button--full"
  }`;

  return (
    <>
      {url ? (
        <Link to={url} className={classes} {...rest}>
          {label}
        </Link>
      ) : (
        <button className={classes} {...rest}>
          {label}
        </button>
      )}
    </>
  );
}

export default Button;
