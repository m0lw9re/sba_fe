import {Form, Input, InputNumber} from "antd";
import {FormInstance} from "antd/lib/form/Form";
import React  from "react";
import {TYPE_FIELD} from "constants/enums";

import {Rule} from "antd/es/form";

type EditableRowProps = {
  index: number;
};
const { INPUT, INPUT_NUMBER} = TYPE_FIELD;

export type EditableCellProps = {
  title: React.ReactNode;
  editable?: boolean;
  children: React.ReactNode;
  dataIndex: any;
  record: any;
  selected: boolean;
  options: any;
  name: string;
  index: number;
  type: TYPE_FIELD;
  disabled?: boolean;
  value?: any;
  onChange?: (e: any) => void;
  onFocus?: () => void;
  onPressEnter?: (e: any) => void;
  addonAfter?: any;
  rules?: Rule[];
  hidden?: boolean;
  autoFocus?: boolean;
  fields?: any[];
  percentable?: boolean;
  currencable?: boolean;
  placeholder?: string;
  form?: any;
};

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
);

export const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
  const [form] = Form.useForm();

  return (
    // <Form form={form} size="small" component={false}>
    //   <EditableContext.Provider value={form}>
    //     <tr {...props} />
    //   </EditableContext.Provider>
    // </Form>
    <>
      <tr {...props} />
    </>
  );
};

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  selected,
  options,
  name,
  index,
  type,
  onChange,
  onPressEnter,
  disabled,
  value,
  hidden,
  autoFocus,
  fields,
  percentable,
  currencable,
  placeholder,
  form,
  rules,
  ...restProps
}) => {
  const setFieldValue = (dataIndex: string, value: any) => {
    form?.setFieldValue([name, index, dataIndex], value);
  };
  
  const getFieldValue = (dataIndex: string) => {
    return form?.getFieldValue([name, index, dataIndex]);
  };

  let childNode = children;

  if (type === INPUT) {
    childNode = (
      <Form.Item
        name={[name, index, dataIndex]}
        initialValue={getFieldValue(dataIndex) ?? null}
        rules={rules}
        style={{display: `${hidden ? "none" : ""}`}}
      >
        <Input
          placeholder={disabled ? "" : "Nhập"}
          disabled={disabled}
          onChange={async (e: any) => {
            setFieldValue(dataIndex, e.target.value);
          }}
        ></Input>
      </Form.Item>
    );
  }
  if (type === INPUT_NUMBER) {
    childNode = (
      <Form.Item
        initialValue={getFieldValue(dataIndex) ?? null}
        name={[name, index, dataIndex]}
        rules={rules}
        style={{display: `${hidden ? "none" : ""}`}}
      >
        {percentable && (
          <InputNumber
            style={{
              width: "100%",
            }}
            disabled={disabled}
            min={0}
            max={100}
            size={"small"}
            formatter={value => `${value}`}
            parser={(value: any) => value!.replace("%", "")}
            placeholder={disabled ? "" : "Nhập"}
            autoFocus={autoFocus}
            onChange={e => {}}
          />
        )}
        {currencable && (
          <InputNumber
            style={{
              width: "100%",
            }}
            disabled={disabled}
            size={"small"}
            formatter={value =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={value => value!.replace(/\$\s?|(,*)/g, "")}
            onChange={e => {}}
            placeholder={!disabled ? placeholder ?? "Nhập" : ""}
          />
        )}
        {!(currencable || percentable) && (
          <InputNumber
            style={{width: "100%"}}
            onChange={e => {}}
            disabled={disabled}
            size={"small"}
            placeholder={disabled ? "" : "Nhập"}
          />
        )}
      </Form.Item>
    );
  }
  

  return <td {...restProps}>{childNode}</td>;
};
