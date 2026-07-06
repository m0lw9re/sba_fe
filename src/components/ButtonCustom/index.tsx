import { Button, ButtonProps } from "antd";
import React from "react";
import "components/ButtonCustom/style.scss";
import { usePermission } from "hooks/usePermission";

type Props = {
  label?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  size?: "small" | "middle" | "large";
  style?: any;
  children?: React.ReactNode;
  code?: string;
};

const ButtonCustom: React.FC<Props & ButtonProps> = ({
  label,
  icon,
  size = "small",
  bgColor,
  textColor,
  style,
  type,
  children,
  code,
  disabled = false,
  ...rest
}) => {
  const isNotAllowed = usePermission(code || null);
  return (
    <Button
      {...rest}
      type={type}
      size={size}
      // có code -> thêm điều kiện check quyền
      disabled={code ? disabled || !isNotAllowed : disabled}
      style={{
        // type primary => bg color default: #2862AF
        background: bgColor
          ? bgColor
          : type === "primary"
          ? "#2862AF"
          : "transparent",
        color: textColor,
        ...style,
      }}
      icon={icon}
      className={`button-custom ${rest.className || ""}`}
    >
      {label || children}
    </Button>
  );
};

export default ButtonCustom;
