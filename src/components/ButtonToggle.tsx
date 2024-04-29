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
  hidden = false,
}: {
  value: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  disabled?: boolean;
  hidden?: boolean;
}) => {
  return (
    !hidden && (
      <button
        onClick={onClick}
        disabled={disabled}
        className={clsx(
          "btn btn-sm text-white text-sm w-56 h-10",
          className,
          value ? activeColor || "btn-error" : inactiveColor || undefined
        )}
      >
        {children}
      </button>
    )
  );
};

export default ButtonToggle;
