import { Select, SelectProps } from "antd";
import React from "react";
import "components/SelectCustom/style.scss";

type Props = {
  onChange: (value: any) => void;
  options: { value: string | number; label: string }[];
  size?: "small" | "middle" | "large";
  showSearch?: boolean;
  value: number | string | null;
  placeholder?: string;
  className?: string;
};

const SelectCustom: React.FC<Props & SelectProps> = ({
  placeholder,
  size,
  className,
  showSearch,
  ...rest
}) => {
  return (
    <Select
      allowClear={true}
      placeholder={placeholder ?? "Chọn"}
      {...rest}
      showSearch={showSearch}
      popupMatchSelectWidth={false}
      filterOption={
        showSearch
          ? (input, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          : undefined
      }
      size={size ?? "small"}
      className={className ? "select-custom " + className : "select-custom"}
    />
  );
};

export default SelectCustom;
