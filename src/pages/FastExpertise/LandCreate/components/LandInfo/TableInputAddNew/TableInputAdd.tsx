import {Button, Table} from "antd";
import {useEffect} from "react";
import {EditableCell, EditableRow} from "./EditTable";
import Icons from "assets/icons";
import {ColumnTypes} from "constants/types/columnTableEdit";
import "./TableInputAdd.scss";
import {randomId} from "utils/string";

const TableInputAdd = ({
  data,
  column,
  setData,
  isCheckbox,
  disabled,
  name,
  form,
  values,
  checkValidateTableOnChange,
  ...rest
}: any): JSX.Element => {
  const addRowTb1 = () => {
    const newData = {
      key: randomId(),
      ...column.reduce((obj: any, col: any) => {
        if (col.dataIndex !== "stt" && obj) {
          if (col.selected) {
            obj[col.placeholder] = "Chọn";
          } else {
            obj[col.placeholder] = "Nhập";
          }
        }
        return null;
      }, {}),
    };

    setData([...data, newData]);
  };

  column.some((item: any) => {
    if (item.key === "action") {
      item.title = (
        <Button
          disabled={disabled}
          type="primary"
          onClick={addRowTb1}
          style={{backgroundColor: "#2862af"}}
          // eslint-disable-next-line react/jsx-pascal-case
          icon={<Icons.add />}
          size="small"
        />
      );
      item.fixed = "right";
      item.render = (_: any, record: {key: string}, index: number) => (
        <Button
          disabled={disabled}
          type="primary"
          danger
          onClick={() => removeRowTb1(record?.key)}
          // eslint-disable-next-line react/jsx-pascal-case
          icon={<Icons.sub />}
          size="small"
        />
      );
    }
    return null;
  });

  const removeRowTb1 = (key: string) => {
    const newData = data.filter((item: any) => item.key !== key);
    setData([...newData]);
  };

  const handleSave = (row: any, index: number) => {
    const newData = data.map((e: any) => ({...e, key: randomId()}));

    newData[index] = row;
    setData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = column
    .filter((e: any) => e.show === true)
    .map((col: any) => {
      return {
        ...col,
        onCell: (record: any, index: number) => ({
          record: data[index],
          selected: col.selected,
          dataIndex: col.dataIndex,
          title: col.title,
          options: col.options,
          onChange: col.onChange,
          index: index,
          handleSave,
          type: col.type,
          disabled: disabled ?? col.disabled,
          value: col.value,
          values: values,
          name: name,
          form: form,
          rules: col.rules,
          autoFocus: col.autoFocus,
          fields: col.fields,
          checkValidateTableOnChange: checkValidateTableOnChange,
          ...col,
        }),
      };
    });

  useEffect(() => {}, [data]);
  
  return (
    <div className="table-input-add">
      <Table
        rowKey={record => record.key}
        components={components}
        rowClassName={"editable-row-2"}
        bordered
        dataSource={data}
        columns={columns as ColumnTypes}
        {...rest}
        pagination={false}
      />
      {/* {data && columnsInit && components && (
        <Form form={form}>
          <Form.Item name={"table"}></Form.Item>
        </Form>
      )} */}
    </div>
  );
};

export default TableInputAdd;
