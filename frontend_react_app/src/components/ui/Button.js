import React from "react";
import cx from "classnames";

// PUBLIC_INTERFACE
export default function Button({ children, variant="primary", className, ...props }) {
  const base = "btn";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost"
  };
  return (
    <button className={cx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
