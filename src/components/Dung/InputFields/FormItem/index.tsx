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
  Typography,
} from "antd";
import {TYPE_FIELD} from "constant/enums";
import React, {useState} from "react";
import "components/InputFields/FormItem/style.scss";
import { numberUtils } from "utils";

type Props = {
  type?: TYPE_FIELD;
  options?: {value: string | number | null; label: string}[];
  optionsAutocomplete?: {value: string | number}[];
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
  error?: any;
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
  align?: any;
  autoFocus?: any;
  rules?: any[];
  name?: any;
  prefix?: any;
  valuePropName?: string;
  tooltipInput?: string;
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
} = TYPE_FIELD;

const {RangePicker} = DatePicker;

const FormItem: React.FC<Props & FormItemProps> = ({
  type,
  options,
  value,
  onChange,
  percentable,
  require,
  currencable,
  selectMultiple,
  formatDatetime,
  placeholder,
  className,
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
  optionsAutocomplete,
  onSelect,
  onClick,
  onKeyDown,
  showSearch,
  align,
  autoFocus,
  rules,
  name,
  prefix,
  valuePropName,
  tooltipInput,
  ...rest
}) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const renderItem = () => {
    switch (type) {
      case INPUT:
        return (
          <>
            {tooltipInput ? (
              <Tooltip title={value || ""}>
                <Input
                  value={value || ""}
                  size={size ?? "small"}
                  onChange={onChange}
                  disabled={disable}
                  suffix={suffixIcon}
                  placeholder={!disable ? placeholder ?? "Nhập" : ""}
                  addonAfter={addonAfter}
                  prefix={prefix}
                  allowClear={true}
                />
              </Tooltip>
            ) : (
              <Input
                value={value || ""}
                size={size ?? "small"}
                onChange={onChange}
                disabled={disable}
                suffix={suffixIcon}
                placeholder={!disable ? placeholder ?? "Nhập" : ""}
                addonAfter={addonAfter}
                prefix={prefix}
                allowClear={true}
              />
            )}
          </>
        );
      case INPUT_PASSWORD:
        return (
          <>
            <Input.Password
              value={value || value}
              size={size ?? "small"}
              onChange={onChange}
              disabled={disable}
              placeholder={!disable ? placeholder ?? "Nhập" : ""}
            />
          </>
        );
      case DATE_PICKER:
        return (
          <DatePicker
            value={value}
            onChange={onChange ?? undefined}
            size={size ?? "small"}
            format={formatDatetime ?? "DD/MM/YYYY"}
            style={{width: "100%"}}
            showTime={showTime ? {format: "HH:mm"} : false}
            disabled={disable}
            placeholder={!disable ? placeholder ?? "Nhập" : ""}
            className="date-picker-custom"
            allowClear={true}
          />
        );
      case RANGE_PICKER:
        return (
          <RangePicker
            className="range-picker-custom"
            suffixIcon={suffixIcon}
            value={value}
            onChange={onChange ?? undefined}
            format={formatDatetime ?? "DD/MM/YYYY"}
            style={{width: "100%"}}
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
                disabled={disable}
                className={
                  align === 'right' ? "input-number-custom-align-right" :
                  align === 'center' ?  "input-number-custom-align-center" :
                  "input-number-custom"
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
                    numberUtils.roundDecimalNumber(parseFloat(value.replace(",", ".")))
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
                disabled={disable}
                className={
                  align === 'right' ? "input-number-custom-align-right" :
                  align === 'center' ?  "input-number-custom-align-center" :
                  "input-number-custom"
                }
                value={value}
                size={size ?? "small"}
                formatter={(value) => {
                  const parts = `${value}`.split(".");
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  return parts.join(",");
                }}
                parser={(value) => value!.replace(/\./g, "").replace(/,/g, ".")}
                onBlur={(e) => {
                  if (!onChange) return;
                  const value = e.target.value;
                  if (value === "") return onChange(null);
                  return onChange(
                    numberUtils.roundDecimalNumber(
                      parseFloat(value.replaceAll(".", "").replace(",", "."))
                    )
                  );
                }}
                onChange={onChange}
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
                onChange={onChange}
                value={value}
                className={
                  align === 'right' ? "input-number-custom-align-right" :
                  align === 'center' ?  "input-number-custom-align-center" :
                  "input-number-custom"
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
        return (
          <>
            <Select
              disabled={disable}
              size={size ?? "small"}
              mode={selectMultiple ? "multiple" : undefined}
              options={options ?? []}
              className={className}
              placeholder={!disable ? placeholder ?? "Chọn" : ""}
              value={value}
              open={openDropdown}
              onFocus={() => {
                setOpenDropdown(true);
              }}
              onBlur={() => {
                setOpenDropdown(false);
              }}
              onSelect={() => {
                setOpenDropdown(false);
              }}
              onChange={onChange}
              showSearch={!showSearch ?? true}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear={true}
              onKeyDown={onKeyDown}
              onClick={onClick}
              virtual
            />
          </>
        );
      case MULTI_SELECT_SEARCH:
        return (
          <>
            <Select
              allowClear={true}
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
              value={value}
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
          <Radio.Group value={true} disabled={disable}>
            {options ? (
              <>
                {options.map(e => {
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
              showCount
              size={size ?? "small"}
              maxLength={10000}
              style={{height: 120, marginBottom: 24}}
              onChange={onChange}
              value={value}
              placeholder={!disable ? placeholder ?? "Nhập" : ""}
              disabled={disable}
              allowClear
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
          <Checkbox.Group disabled={disable} onChange={onChange}>
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
              <Typography.Text
                className="form-item-text"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginRight: "5px",
                }}
              >
                {label}

                {rules?.findIndex(e => e.required == true) != undefined &&
                rules?.findIndex(e => e.required == true) != -1 ? (
                  <span style={{color: "#F25B60"}}> *</span>
                ) : (
                  ""
                )}
              </Typography.Text>
            </Tooltip>
          ) : null
        }
        rules={rules}
        valuePropName={valuePropName}
      >
        {renderItem()}
      </Form.Item>
    </>
  );
};

export default FormItem;
