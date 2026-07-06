import { Button, Space, Table, TableProps } from "antd";
import React, { useState } from "react";
import { EditableCell, EditableRow } from "./EditTable";
import Icons from "assets/icons";
import "./TableInputAddCustom.scss";
import { TYPE_FIELD } from "constant/enums";
import { RowSelectionType } from "antd/es/table/interface";
import ButtonCustom from "components/ButtonCustom";

type EditableTableProps = Parameters<typeof Table>[0];

export type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export type ColumnsEdit = (ColumnTypes[number] & {
  editable?: boolean;
  editableNumber?: boolean;
  percentable?: boolean;
  disable?: boolean;
  dataIndex: string;
  selected?: boolean;
  minNumber?: number;
  maxNumber?: number;
  options?: { value: string | number; label: string }[];
  formatterNumber?: (data?: string | number) => string;
  optionsDynamic?: { value: string | number; label: string }[];
  suffix?: React.ReactNode;
  rules?: Array<any>;
  showSearch?: boolean;
  placeholder?: string;
  className?: string;
  formatDatetime?: string;
  handleChangeSelect?: (index: number, value: string | number) => void;
  error?: Array<any>;
  touched?: Array<any>;
  isEdit?: boolean;
  isPrinter?: boolean;
  isDelete?: boolean;
  show?: boolean;
  type?: RowSelectionType;
  name?: string;
  isAdd?: boolean;
  datePicker?: boolean;
  rangePicker?: boolean;
  popupInput?: boolean;
  maxLength?: number;
  types?: TYPE_FIELD;
})[];

type Props = {
  data: any;
  column: any;
  isLoading?: boolean;
  setData: (data: any) => void;
  handleAdd?: () => void;
  handleRemove?: (index: string, record: any) => void;
  handleCopy?: (index: number) => void;
  isCheckbox: boolean;
  types?: TYPE_FIELD;
  disabledActions?: boolean;
};

const TableInputAdd: React.FC<Props & TableProps<any>> = ({
  data,
  column,
  setData,
  handleAdd,
  handleRemove,
  isLoading,
  isCheckbox,
  types,
  handleCopy,
  disabledActions = false,
  ...rest
}): JSX.Element => {
  const addRowTb1 = () => {
    const newData = {
      key: data.length + 1,
      ...column.reduce((obj: any, col: any) => {
        if (col.dataIndex !== "stt" && obj) {
          if (col.selected) {
            obj[col.placeholder] = "Chọn";
            obj[col.dataIndex] = 0;
          } else {
            obj[col.placeholder] = "Nhập";
            obj[col.dataIndex] = "";
          }
          return obj;
        }
      }, {}),
    };
    setData([...data, newData]);
  };

  column.some((item: any) => {
    if (item.key === "action") {
      item.title = (
        <Button
          type="primary"
          onClick={handleAdd || addRowTb1}
          style={{
            borderColor: disabledActions ? '#d9d9d9' : '#2862af',
            color: disabledActions ? 'rgba(0, 0, 0, 0.25)' : '#fff',
            backgroundColor: disabledActions ? 'rgba(0, 0, 0, 0.04)' : '#2862af'
          }}
          icon={<Icons.add />}
          size="small"
          disabled={disabledActions}
        />
      );
      item.render = (_: any, record: { key: string }, rowIndex: number) => (
        <Space size="small">
          {handleCopy && (
            <ButtonCustom
              bgColor="#00b335"
              size="small"
              icon={<Icons.copy style={{ color: "#FFFFFF" }} />}
              onClick={() => handleCopy(rowIndex)}
            />
          )}
          <Button
            type="primary"
            danger
            onClick={() => {
              if (handleRemove) {
                return handleRemove(record.key, record);
              } else return removeRowTb1(record.key);
            }}
            icon={<Icons.sub />}
            size="small"
            tabIndex={-1}
            disabled={disabledActions}
          />
        </Space>
      );
    }
  });

  const removeRowTb1 = (key: any) => {
    const foundIndex = data?.findIndex((el: any) => el.key === key);
    if (foundIndex === -1) return;
    const newData = [...data];
    newData.splice(foundIndex, 1);
    // const newData = data.filter((item: any) => item.key !== key);
    setData(newData);
    column.some((col: any) => {
      if (col?.optionsDynamic) {
        const newOptions = [...col.optionsDynamic];
        newOptions.splice(foundIndex, 1);
        col.optionsDynamic = newOptions;
      }
    });
  };

  const handleSave = (row: any) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    if (index === -1) return;
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = column.map((col: any) => {
    if (
      !col.editable &&
      !col.selected &&
      !col.datePicker &&
      !col.rangePicker &&
      !col.popupInput &&
      !col.editableNumber &&
      !col.percentable
    ) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, rowIndex: number) => {
        return {
          record,
          datePicker: col.datePicker,
          rangePicker: col.rangePicker,
          popupInput: col.popupInput,
          maxLength: col.maxLength,
          editable: record.isView ? false : col.editable,
          selected: col.selected,
          dataIndex: col.dataIndex,
          minNumber: col.minNumber,
          maxNumber: col.maxNumber,
          suffix: col.suffix,
          className: col.className,
          title: col.title,
          disable: record.isView ? true : col.disable,
          showSearch: col.showSearch,
          editableNumber: record.isView ? false : col.editableNumber,
          percentable: record.isView ? false : col.percentable,
          options: col.optionsDynamic
            ? col.optionsDynamic[rowIndex]
            : col.options,
          formatDatetime: col.formatDatetime,
          formatterNumber: col.formatterNumber,
          name: col.name,
          error: col?.error ? col.error[rowIndex] : undefined,
          touched: col?.touched ? col.touched[rowIndex] : undefined,
          rules: col.rules,
          placeholder: col.placeholder,
          handleSave,
          handleChangeSelect: col.handleChangeSelect,
          types: col.types,
        };
      },
    };
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      size="small"
      className="form-item-table-add-custom-container"
      loading={isLoading}
      {...rest}
      components={components}
      rowClassName={() => "editable-row"}
      bordered
      dataSource={data}
      columns={columns as ColumnTypes}
      rowSelection={isCheckbox ? rowSelection : undefined}
      pagination={false}
    />
  );
};

export default TableInputAdd;
