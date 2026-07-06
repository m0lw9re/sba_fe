import { DatePicker, DatePickerProps } from "antd";
import { DATE_TIME_FORMAT } from "constants/enums";
import React from "react";
import "components/DatePickerCustom/style.scss";

type Props = {
  format?: string;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  //showTime: boolean;
  onChange: (value: DatePickerProps["value"], dateString: string) => void;
};

const { dateTime } = DATE_TIME_FORMAT;

const DatePickerCustom: React.FC<Props & DatePickerProps> = ({
  format,
  onChange,
  size,
  placeholder,
  //showTime = false,
  ...rest
}) => {
  return (
    <DatePicker
      allowClear
      format={format ?? dateTime}
      size={size ?? "small"}
      onChange={onChange}
      placeholder={placeholder ?? "Chọn ngày"}
      className="datepicker-custom"
      {...rest}
    />
  );
};

export default DatePickerCustom;
