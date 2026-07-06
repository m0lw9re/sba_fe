import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip,
  FormItemProps,
  AutoComplete,
  Checkbox,
  Radio,
  Row,
  Col,
} from "antd";
import { TYPE_FIELD } from "constant/enums";
import React from "react";
import "components/InputFields/FormItem/style.scss";
import { Rule } from "antd/es/form";
import { numberUtils } from "utils";
import PopupInput from "./PopupInput";
import dayjs from "dayjs";
import { customWeekStartEndFormat } from "utils/date";

type Props = {
  type?: TYPE_FIELD;
  options?: {
    value: string | number | null;
    label: string;
    disabled?: boolean;
  }[];
  optionsAutocomplete?: { value: string | number }[];
  value?: any;
  addonAfter?: string;
  percentable?: boolean;
  currencable?: boolean;
  placeholder?: string;
  placeholderRangepicker?: [string, string];
  disable?: boolean;
  max?: number;
  size?: "small" | "middle" | "large";
  min?: number;
  require?: boolean;
  selectMultiple?: boolean;
  label?: any;
  className?: string;
  showTime?: boolean;
  formatDatetime?: string;
  showCount?: boolean;
  error?: any;
  // touched tránh việc luôn bị validate onChange
  touched?: any;
  formatter?: (data?: string | number) => string;
  parser?: (data?: string) => string;
  onChange?: any;
  onClick?: any;
  onSelect?: (value: string) => void;
  onKeyDown?: any;
  onSearch?: any;
  showSearch?: boolean;
  suffixIcon?: React.ReactNode;
  allowClear?: boolean;
  align?: "left" | "right" | "center";
  autoFocus?: any;
  rules?: Rule[];
  name?: any;
  prefix?: any;
  valuePropName?: string;
  tooltipInput?: string;
  maxLength?: number;
  textAreaHeight?: number;
  defaultValue?: string | number;
  isRounded?: boolean;
  disabledDate?: any;
  rows?: any;
  tabIndex?: any;
};

const {
  DATE_PICKER,
  INPUT,
  INPUT_NUMBER,
  SELECT,
  TEXT_AREA,
  AUTO_COMPLETE,
  RANGE_PICKER,
  MULTI_SELECT_SEARCH,
  INPUT_PASSWORD,
  CHECKBOX,
  RADIO,
  CHECKBOX_GROUP,
  POPUP_INPUT,
  MULTI_TEXT_ITEMS,
  WEEK_PICKER,
} = TYPE_FIELD;

const { RangePicker } = DatePicker;

const FormItem: React.FC<Props & FormItemProps> = ({
  defaultValue,
  type,
  options,
  value,
  onChange,
  percentable,
  require,
  currencable,
  isRounded = false,
  selectMultiple,
  formatDatetime,
  placeholder,
  className,
  touched,
  placeholderRangepicker,
  error,
  max,
  min,
  suffixIcon,
  allowClear,
  size,
  disable,
  label,
  showTime,
  formatter,
  addonAfter,
  parser,
  onSearch,
  showCount,
  optionsAutocomplete,
  onSelect,
  onClick,
  onKeyDown,
  showSearch,
  align = "left",
  autoFocus,
  rules,
  name,
  prefix,
  valuePropName,
  tooltipInput,
  maxLength,
  textAreaHeight = 120,
  disabledDate,
  rows,
  tabIndex,
  ...rest
}) => {
  const renderItem = () => {
    switch (type) {
      case INPUT:
        return (
          <>
            {tooltipInput ? (
              <Tooltip title={value || ""}>
                <Input
                  tabIndex={tabIndex}
                  value={value || ""}
                  size={size ?? "small"}
                  onChange={onChange}
                  disabled={disable}
                  suffix={suffixIcon}
                  placeholder={!disable ? placeholder ?? "Nhập" : ""}
                  spellCheck={false}
                  addonAfter={addonAfter}
                  prefix={prefix}
                  allowClear={true}
                />
              </Tooltip>
            ) : (
              <Input
                tabIndex={tabIndex}
                value={value || ""}
                size={size ?? "small"}
                onChange={onChange}
                disabled={disable}
                suffix={suffixIcon}
                spellCheck={false}
                placeholder={!disable ? placeholder ?? "Nhập" : ""}
                addonAfter={addonAfter}
                prefix={prefix}
                allowClear={true}
              />
            )}
          </>
        );
      case MULTI_TEXT_ITEMS:
        return (
          <Select
            tabIndex={tabIndex}
            mode="tags"
            style={{ width: "100%" }}
            tokenSeparators={[",\n"]}
            size={size ?? "small"}
            value={value ? value.split(";") : []}
            options={
              value
                ? value.split(";").map((item: any) => ({
                    label: item,
                    value: item,
                  }))
                : []
            }
            onChange={onChange}
            disabled={disable}
            placeholder={!disable ? placeholder ?? "Nhập" : ""}
            allowClear={allowClear}
          />
        );
      case INPUT_PASSWORD:
        return (
          <>
            <Input.Password
              tabIndex={tabIndex}
              value={value || value}
              size={size ?? "small"}
              onChange={onChange}
              disabled={disable}
              placeholder={!disable ? placeholder ?? "Nhập" : ""}
            />
          </>
        );
      case POPUP_INPUT: {
        return (
          <PopupInput
            value={value}
            onChange={onChange}
            size={size}
            placeholder={placeholder}
            disable={disable}
            addonAfter={addonAfter}
            suffixIcon={suffixIcon}
            prefix={prefix}
            maxLength={maxLength}
          />
        );
      }
      case WEEK_PICKER:
        return (
          <DatePicker
            defaultValue={dayjs()}
            format={customWeekStartEndFormat}
            picker="week"
            value={value}
            onChange={onChange ?? undefined}
            size={size ?? "small"}
            style={{ width: "100%", ...rest.style }}
            placeholder={!disable ? placeholder ?? "Chọn tuần" : ""}
            className="date-picker-custom"
          />
        );
      case DATE_PICKER:
        return (
          <DatePicker
            tabIndex={tabIndex}
            value={value}
            onChange={onChange ?? undefined}
            size={size ?? "small"}
            format={formatDatetime ?? "DD/MM/YYYY"}
            style={{ width: "100%", ...rest.style }}
            showTime={showTime ? { format: "HH:mm:ss" } : false}
            use12Hours={false}
            disabled={disable}
            disabledDate={disabledDate}
            placeholder={!disable ? placeholder ?? "Nhập" : ""}
            className="date-picker-custom"
            allowClear={allowClear === false ? false : true}
          />
        );
      case RANGE_PICKER:
        return (
          <RangePicker
            tabIndex={tabIndex}
            className="range-picker-custom"
            suffixIcon={suffixIcon}
            value={value}
            onChange={onChange ?? undefined}
            format={formatDatetime ?? "DD/MM/YYYY"}
            style={{ width: "100%" }}
            size={size ?? "small"}
            allowClear={allowClear}
            disabled={disable}
            placeholder={
              !disable
                ? placeholderRangepicker ?? ["Từ ngày", "Đến ngày"]
                : ["", ""]
            }
          />
        );
      case INPUT_NUMBER:
        if (percentable) {
          return (
            <>
              <InputNumber
                tabIndex={tabIndex}
                style={rest.style}
                disabled={disable}
                className={
                  align === "right"
                    ? "input-number-custom-align-right"
                    : align === "center"
                    ? "input-number-custom-align-center"
                    : "input-number-custom"
                }
                min={0}
                max={100}
                value={value}
                size={size ?? "small"}
                formatter={(value) => {
                  const parts = `${value}`.split(".");
                  return parts.join(",");
                }}
                parser={(value) => value!.replace(/\./g, "").replace(/,/g, ".")}
                onBlur={(e) => {
                  if (!onChange) return;
                  const value = e.target.value;

                  if (value === "") return onChange(null);
                  return onChange(
                    numberUtils.roundDecimalNumber(
                      parseFloat(value.replace(",", "."))
                    )
                  );
                }}
                onChange={onChange}
                placeholder={!disable ? placeholder ?? "Nhập" : ""}
                addonAfter={addonAfter}
                autoFocus={autoFocus}
                controls={false}
              />
            </>
          );
        } else if (currencable)
          return (
            <>
              <InputNumber
                tabIndex={tabIndex}
                disabled={disable}
                className={
                  align === "right"
                    ? "input-number-custom-align-right"
                    : align === "center"
                    ? "input-number-custom-align-center"
                    : "input-number-custom"
                }
                value={
                  isRounded
                    ? numberUtils.roundNumber(value)
                    : numberUtils.roundDecimalNumber(value)
                }
                size={size ?? "small"}
                formatter={(value) => {
                  const parts = `${value}`.split(".");
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  return parts.join(",");
                }}
                parser={(value) =>
                  Number(value!.replace(/\./g, "").replace(/,/g, "."))
                }
                onBlur={(e) => {
                  if (!onChange) return;

                  const value = e.target.value;
                  if (value === "") return onChange(null);
                  if (isRounded) {
                    return onChange(
                      numberUtils.roundNumber(
                        parseFloat(value.replaceAll(".", "").replace(",", "."))
                      )
                    );
                  } else {
                    return onChange(
                      numberUtils.roundDecimalNumber(
                        parseFloat(value.replaceAll(".", "").replace(",", "."))
                      )
                    );
                  }
                }}
                onChange={(value) => {
                  if (isRounded) {
                    return onChange(numberUtils.roundNumber(value));
                  } else {
                    return onChange(numberUtils.roundDecimalNumber(value));
                  }
                }}
                placeholder={!disable ? placeholder ?? "Nhập" : ""}
                addonAfter={addonAfter}
                controls={false}
              />
            </>
          );
        else
          return (
            <>
              <InputNumber
                tabIndex={tabIndex}
                onChange={onChange}
                value={
                  numberUtils.roundDecimalNumber(value) !== null
                    ? numberUtils.roundDecimalNumber(value)
                    : value
                }
                className={
                  align === "right"
                    ? "input-number-custom-align-right"
                    : align === "center"
                    ? "input-number-custom-align-center"
                    : "input-number-custom"
                }
                disabled={disable}
                formatter={formatter}
                size={size ?? "small"}
                parser={parser}
                min={min}
                max={max}
                placeholder={!disable ? placeholder ?? "Nhập" : ""}
                addonAfter={addonAfter}
              />
            </>
          );
      case SELECT:
        // Check if value exists in options
        // const valueExists = options?.some((option) => option.value === value);
        return (
          <>
            <Select
              tabIndex={tabIndex}
              defaultValue={defaultValue}
              disabled={disable}
              size={size ?? "small"}
              mode={selectMultiple ? "multiple" : undefined}
              options={options ?? []}
              className={className}
              placeholder={!disable ? placeholder ?? "Chọn" : ""}
              value={value || null}
              onChange={onChange}
              showSearch={true}
              onSearch={(value) => (onSearch ? onSearch(value) : null)}
              // showSearch={!showSearch ?? true}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear={allowClear ?? true}
              onKeyDown={onKeyDown}
              onClick={onClick}
              popupMatchSelectWidth={true}
              virtual={true}
            />
          </>
        );
      case MULTI_SELECT_SEARCH:
        return (
          <>
            <Select
              tabIndex={tabIndex}
              disabled={disable}
              mode="multiple"
              tokenSeparators={[","]}
              size={size ?? "small"}
              options={options ?? []}
              className={className}
              placeholder={!disable ? placeholder ?? "Chọn" : ""}
              value={value}
              onChange={onChange}
              onClick={onClick}
              allowClear
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              //showSearch={showSearch}
              // filterOption={
              //   showSearch
              //     ? (input, option) =>
              //       (option?.label ?? "")
              //         .toLowerCase()
              //         .includes(input.toLowerCase())
              //     : undefined
              // }
            />
          </>
        );
      case AUTO_COMPLETE:
        return (
          <>
            <AutoComplete
              tabIndex={tabIndex}
              value={value}
              disabled={disable}
              size={size ?? "small"}
              placeholder={!disable ? placeholder ?? "Chọn hoặc nhập" : ""}
              onSearch={onSearch}
              onSelect={onSelect}
              onChange={onChange}
              options={optionsAutocomplete ?? []}
              onClick={onClick}
            />
          </>
        );
      case RADIO:
        return (
          <Radio.Group value={value} disabled={disable} onChange={onChange}>
            {options ? (
              <>
                {options.map((e) => {
                  return <Radio value={e?.value}>{e?.label}</Radio>;
                })}
              </>
            ) : (
              <>
                {" "}
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </>
            )}
          </Radio.Group>
        );
      case TEXT_AREA:
        return (
          <>
            <Input.TextArea
              showCount={showCount ?? true}
              size={size ?? "small"}
              spellCheck={false}
              maxLength={maxLength || 1500}
              style={{ height: textAreaHeight, marginBottom: 24 }}
              onChange={onChange}
              value={value}
              placeholder={!disable ? placeholder ?? "Nhập" : ""}
              disabled={disable}
              allowClear={allowClear}
              rows={rows || 1}
            />
          </>
        );
      case CHECKBOX:
        return (
          <Checkbox
            value={value}
            disabled={disable}
            onChange={onChange}
          ></Checkbox>
        );
      case CHECKBOX_GROUP:
        return (
          <Checkbox.Group disabled={disable} onChange={onChange} value={value}>
            <Row>
              {options?.map((item: any, index: any) => (
                <Col key={index} span={item.span}>
                  <Checkbox
                    value={item.value}
                    style={{
                      width: "100%",
                    }}
                  >
                    {item.label}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Form.Item
        {...rest}
        initialValue={value ?? null}
        colon={false}
        name={name}
        className="form-item-input-container"
        label={
          label ? (
            <Tooltip placement="bottom" title={label}>
              {require ? (
                <>
                  {label}
                  <span style={{ color: "#F25B60" }}> *</span>
                </>
              ) : (
                label
              )}
            </Tooltip>
          ) : null
        }
        validateStatus={touched && error ? "error" : ""}
        help={touched && error}
        valuePropName={valuePropName}
      >
        {renderItem()}
      </Form.Item>
    </>
  );
};

export default FormItem;
