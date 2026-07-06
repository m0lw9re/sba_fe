import { Input, InputProps } from "antd";
import React from "react";
import "components/InputCustom/style.scss";

type Props = {
  value: string | number;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  suffix?: React.ReactNode;
  addonAfter?: string;
};

const InputCustom: React.FC<Props & InputProps> = ({
  value,
  placeholder,
  suffix,
  size,
  addonAfter,
  ...rest
}) => {
  return (
    <Input
      className="input-custom"
      value={value}
      size={size ?? "small"}
      suffix={suffix ?? undefined}
      addonAfter={addonAfter ?? undefined}
      placeholder={placeholder ?? "Nhập"}
      {...rest}
    />
  );
};

export default InputCustom;
