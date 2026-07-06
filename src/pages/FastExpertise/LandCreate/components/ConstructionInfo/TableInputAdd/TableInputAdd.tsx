import {Button, Row, Table} from "antd";
import React, {useEffect} from "react";
import {EditableCell, EditableRow} from "./EditTable";
import Icons from "assets/icons";
import {ColumnTypes} from "constants/types/columnTableEdit";
import "./TableInputAdd.scss";
import {randomId} from "utils/string";
import ButtonCustom from "components/ButtonCustom";

const TableInputAdd = ({
  data,
  column,
  setData,
  isCheckbox,
  disabled,
  name,
  form,
  ...rest
}: any): JSX.Element => {
  const addRowTb1 = () => {
    const newData = {
      key: randomId(),
    };

    setData([...form.getFieldValue(name), newData]);
  };

  column.some((item: any) => {
    if (item.key === "action") {
      item.title = (
        <Row justify={'center'}>
          <ButtonCustom
            bgColor="#2862AF"
            type="primary"
            disabled={disabled}
            onClick={addRowTb1}
            icon={<Icons.add />}
            size="small"
          />
        </Row>
      );
      item.fixed = "right";
      item.render = (_: any, record: {key: string}, index: number) => (
        <Button
          disabled={disabled}
          type="primary"
          danger
          onClick={() => removeRowTb1(record?.key)}
          icon={<Icons.sub />}
          size="small"
        />
      );
    }
  });

  const removeRowTb1 = (key: string) => {
    const previousFormList = form.getFieldValue([name]);

    const indexRemove = data.findIndex((e: any) => e?.key === key);
    const afterFormList = previousFormList.filter(
      (e: any, index: number) => index !== indexRemove
    );
    form.setFieldValue([name], afterFormList);

    const newData = data.filter((item: any) => item.key !== key);
    setData([...newData]);
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
          type: col.type,
          disabled: disabled ?? col.disabled,
          value: col.value,
          name: name,
          form: form,
          rules: col.rules,
          autoFocus: col.autoFocus,
          fields: col.fields,
          ...col,
        }),
      };
    });

  useEffect(() => {}, [data]);
  return (
    <div className="table-input-add custom-dung">
      <Table
        rowKey={record => record.key}
        components={components}
        rowClassName={"editable-row-2"}
        bordered
        dataSource={data}
        columns={columns as ColumnTypes}
        {...rest}
        scroll={{x: 1200}}
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
