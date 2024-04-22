import clsx from "clsx";
import React from "react";

const ButtonToggle = ({
  value,
  children,
  onClick,
  activeColor,
  inactiveColor,
  className,
  disabled,
}: {
  value: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "btn",
        className,
        value ? activeColor || "btn-error" : inactiveColor || undefined
      )}
    >
      {children}
    </button>
  );
};

export default ButtonToggle;
