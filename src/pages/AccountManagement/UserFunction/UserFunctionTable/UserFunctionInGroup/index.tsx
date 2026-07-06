import React, { Fragment } from "react";
import { defaultColumns } from "./config";
import { Table } from "antd";
import "pages/AccountManagement/UserFunction/UserFunctionTable/UserFunctionInGroup/style.scss";
import { TableRowSelection } from "antd/es/table/interface";

type FunctionTableType = {
  key?: React.Key;
  functionCode: number;
  functionName: string;
  children?: Array<FunctionTableType>;
};

type Props = {
  userInGroup: any;
  setKeys: (keys: Array<React.Key>) => void;
  selectedKeys: Array<React.Key>;
};

const UserFunctionInGroup: React.FC<Props> = ({
  userInGroup,
  selectedKeys,
  setKeys,
}) => {
  const dataSource = userInGroup.filter(
    (item: any) => item?.children.length > 0
  );
  const rowSelection: TableRowSelection<FunctionTableType> = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setKeys(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  return (
    <Fragment>
      <Table
        className="user-in-group-table-container"
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
          checkStrictly: false,
        }}
        columns={defaultColumns}
        dataSource={dataSource}
        bordered={true}
      />
    </Fragment>
  );
};

export default UserFunctionInGroup;
