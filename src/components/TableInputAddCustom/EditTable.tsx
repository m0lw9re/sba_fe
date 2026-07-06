import { Form, InputNumber } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import React from "react";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import "components/TableInputAddCustom/style.scss";
import dayjs from "dayjs";

type EditableRowProps = {
  index: number;
};

export type EditableCellProps = {
  title: React.ReactNode;
  editable: boolean;
  editableNumber: boolean;
  percentable: boolean;
  datePicker: boolean;
  rangePicker: boolean;
  popupInput: boolean;
  maxLength: number;
  children: React.ReactNode;
  minNumber?: number;
  maxNumber?: number;
  className?: string;
  formatterNumber?: (data?: string | number) => string;
  disable?: boolean;
  rules?: Array<any>;
  placeholder?: string;
  error?: any;
  touched?: any;
  showSearch?: boolean;
  isDelete?: boolean;
  formatDatetime?: string;
  handleChangeSelect?: (index: number, value: string | number) => void;
  dataIndex: any;
  suffix?: React.ReactNode;
  record: any;
  selected: boolean;
  options: any;
  name: string;
  handleSave: (record: any) => void;
};

const { SELECT, INPUT, DATE_PICKER, RANGE_PICKER, INPUT_NUMBER, POPUP_INPUT } =
  TYPE_FIELD;

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
);

export const EditableRow: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  datePicker,
  rangePicker,
  popupInput,
  maxLength,
  children,
  dataIndex,
  disable,
  className,
  record,
  showSearch,
  selected,
  formatDatetime,
  rules,
  placeholder,
  editableNumber,
  formatterNumber,
  suffix,
  options,
  error,
  touched,
  minNumber,
  maxNumber,
  handleSave,
  handleChangeSelect,
  name,
  percentable,
  ...restProps
}) => {
  const onKeyDown = (event: any) => {
    if (event.key === "Tab") {
      event.preventDefault();
    }
  };

  let childNode: any = children;

  if (editable) {
    childNode = (
      <FormItem
        type={INPUT}
        disable={disable}
        className={className}
        placeholder={placeholder}
        error={error?.[dataIndex]}
        touched={touched?.[dataIndex]}
        onChange={(e: any) => {
          handleSave({ ...record, [dataIndex]: e.target.value });
        }}
        value={record[dataIndex]}
      />
    );
  }

  if (editableNumber) {
    childNode = (
      <FormItem
        type={INPUT_NUMBER}
        max={maxNumber}
        min={minNumber}
        disable={disable}
        className={className}
        formatter={formatterNumber}
        placeholder={placeholder}
        error={error?.[dataIndex]}
        touched={touched?.[dataIndex]}
        onChange={(value: number | string) => {
          handleSave({ ...record, [dataIndex]: value === "" ? null : value });
        }}
        value={record[dataIndex]}
        currencable
      />
    );
  }
  if (selected) {
    childNode = (
      <FormItem
        type={SELECT}
        disable={disable}
        className={className}
        placeholder={placeholder}
        error={error?.[dataIndex]}
        touched={touched?.[dataIndex]}
        options={options}
        showSearch={showSearch}
        onChange={(value: number | string) => {
          if (handleChangeSelect) {
            handleChangeSelect(record.key, value);
          } else {
            handleSave({ ...record, [dataIndex]: value });
          }
        }}
        allowClear={restProps.isDelete}
        value={record[dataIndex]}
      />
    );
  }

  if (datePicker) {
    childNode = (
      <FormItem
        error={error?.[dataIndex]}
        touched={touched?.[dataIndex]}
        type={DATE_PICKER}
        disable={disable}
        className={className}
        // value={record[dataIndex] ? dayjs(record[dataIndex]) : null}
        formatDatetime={formatDatetime}
        placeholder={placeholder ?? formatDatetime ?? "DD/MM/YYYY"}
        onChange={(date: any, dateString: string) => {
          if (dateString) {
            handleSave({
              ...record,
              [dataIndex]: date ? dayjs(date).toISOString() : null,
            });
          }
        }}
      />
    );
  }

  if (rangePicker) {
    childNode = (
      <FormItem
        type={RANGE_PICKER}
        disable={disable}
        className={className}
        suffixIcon={suffix}
        placeholderRangepicker={["Từ ngày", "Đến ngày"]}
        formatDatetime={formatDatetime}
      />
    );
  }
  if (popupInput) {
    childNode = (
      <FormItem
        type={POPUP_INPUT}
        disable={disable}
        className={className}
        maxLength={maxLength}
        placeholder={placeholder}
        error={error?.[dataIndex]}
        touched={touched?.[dataIndex]}
        onChange={(e: any) => {
          handleSave({ ...record, [dataIndex]: e.target.value });
        }}
        value={record[dataIndex]}
      />
    );
  }
  if (percentable) {
    childNode = (
      <FormItem
        type={INPUT_NUMBER}
        max={maxNumber}
        min={minNumber}
        disable={disable}
        className={className}
        formatter={formatterNumber}
        placeholder={placeholder}
        error={error?.[dataIndex]}
        touched={touched?.[dataIndex]}
        onChange={(value: number) => {
          handleSave({ ...record, [dataIndex]: value });
        }}
        value={record[dataIndex]}
        percentable
      />
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
