import { Table } from "antd";
import { Fragment } from "react";
import { areaSettingColumns } from "./config";
import './style.scss'

type Props = {
  type: "in" | "not-in";
  data: Array<any>;
  selectedRowKeys: string[];
  onSelectRow: (selectedRow: string[]) => void;
};

const AreaSettingGroupItem = ({
  data,
  onSelectRow,
  type,
  selectedRowKeys,
}: Props) => {
  return (
    <Fragment>
      <Table
        className={
          type === "in"
            ? "user-in-group-table-container"
            : "user-not-in-group-table-container"
        }
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys: React.Key[]) => {
            onSelectRow(selectedRowKeys as string[]);
          },
          selectedRowKeys,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              if (selectedRowKeys.includes(record.code)) {
                onSelectRow(
                  selectedRowKeys.filter((item) => item !== record.code)
                );
              } else {
                onSelectRow([...selectedRowKeys, record.code as string]);
              }
            },
            style: { cursor: "pointer" },
          };
        }}
        columns={areaSettingColumns}
        dataSource={
          data?.map((item) => ({
            ...item,
            key: item.code,
          })) || []
        }
        bordered={true}
        pagination={false}
        scroll={{
          scrollToFirstRowOnChange: true,
          y: 400,
        }}
      ></Table>
    </Fragment>
  );
};

export default AreaSettingGroupItem;
