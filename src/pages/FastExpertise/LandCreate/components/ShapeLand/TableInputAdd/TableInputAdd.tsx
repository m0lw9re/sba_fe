import {Button, Row, Table} from "antd";
import {useEffect} from "react";
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

  const addRowTb = () => {
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
            disabled={disabled}
            type="primary"
            onClick={addRowTb}
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
          onClick={() => removeRowTb(record?.key)}
          icon={<Icons.sub />}
          size="small"
        />
      );
    }
  });

  const removeRowTb = (key: string) => {
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

  return (
    <div className="table-input-add custom-dung">
      <Table
        rowKey={record => record.key}
        components={components}
        rowClassName={"editable-row-2"}
        bordered
        dataSource={data}
        columns={columns as ColumnTypes}
        scroll={{x: 1200}}
        pagination={false}
        {...rest}
      />
    </div>
  );
};

export default TableInputAdd;
