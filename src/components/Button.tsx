interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  label: string;
  color?: string;
  url?: string;
}

function Button(props: ButtonProps) {
  const { label, color = "primary", url = null, ...rest } = props;

  const classes = `c-button ${"c-button--" + color}`;

  return (
    <>
      {url ? (
        <a href={url} className={classes} {...rest}>
          {label}
        </a>
      ) : (
        <button className={classes} {...rest}>
          {label}
        </button>
      )}
    </>
  );
}

export default Button;
