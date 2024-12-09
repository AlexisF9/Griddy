import { Link } from "react-router";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  label: string;
  color?: string;
  url?: string;
  fullWidth?: boolean;
  isLink?: boolean;
  icon?: React.ReactNode;
}

function Button(props: ButtonProps) {
  const {
    label,
    fullWidth = false,
    color = "primary",
    url = null,
    isLink = false,
    icon = null,
    ...rest
  } = props;

  const classes = `c-button ${"c-button--" + color} ${
    fullWidth && "c-button--full"
  } ${isLink && "c-button--link"}`;

  return (
    <>
      {url ? (
        <Link to={url} className={classes} {...rest}>
          {icon}
          {label}
        </Link>
      ) : (
        <button className={classes} {...rest}>
          {icon}
          {label}
        </button>
      )}
    </>
  );
}

export default Button;
