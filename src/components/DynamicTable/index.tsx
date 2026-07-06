import "./style.scss";
import { Button, Space, Table, TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import { FC, ReactNode } from "react";

type Props = {
  onAddRow?: () => void;
  onRemoveRow?: (data: any, index: number) => void;
  columns: ColumnsType<any>;
  dataSource: Array<any>;
  otherButton?: (data: any, index: any) => ReactNode;
  hiddenRow?: boolean;
};

export const DynamicTable: FC<TableProps<any> & Props> = ({
  columns,
  dataSource,
  onAddRow,
  onRemoveRow,
  otherButton,
  hiddenRow = false,
  ...rest
}) => {
  const defaultColumns: ColumnsType<any> = [
    {
      title: onAddRow ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ backgroundColor: "#2862af" }}
            type="primary"
            size="small"
            icon={<Icons.add />}
            onClick={onAddRow}
          />
        </div>
      ) : (
        <></>
      ),
      fixed: "right",
      render: (_, record, index) => (
        <Space style={{ display: "flex", justifyContent: "center" }}>
          {otherButton && otherButton(record, index)}
          {onRemoveRow && (
            <ButtonCustom
              bgColor="#f25b60"
              size="small"
              icon={<Icons.sub style={{ color: "#FFFFFF" }} />}
              onClick={() => onRemoveRow(record, index)}
            />
          )}
        </Space>
      ),
      width: "30px",
    },
  ];

  return (
    <Table
      className="dynamic-table-wrapper"
      pagination={false}
      columns={hiddenRow ? columns : [...columns, ...defaultColumns]}
      dataSource={dataSource}
      bordered
      {...rest}
    />
  );
};
