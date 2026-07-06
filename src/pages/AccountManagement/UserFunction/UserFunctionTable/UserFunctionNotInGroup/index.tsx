import React, { Fragment } from "react";
import { defaultColumns } from "./config";
import { Table } from "antd";
import "pages/AccountManagement/UserFunction/UserFunctionTable/UserFunctionNotInGroup/style.scss";
import { TableRowSelection } from "antd/es/table/interface";

type FunctionTableType = {
  key?: React.Key;
  functionCode: number;
  functionName: string;
  children?: Array<FunctionTableType>;
};

type Props = {
  userNotInGroup: any;
  setKeys: (keys: Array<React.Key>) => void;
  selectedKeys: Array<React.Key>;
};

const UserFunctionNotInGroup: React.FC<Props> = ({
  userNotInGroup,
  selectedKeys,
  setKeys,
}) => {
  const dataSource = userNotInGroup.filter(
    (item: any) => item?.children.length > 0
  );
  const rowSelection: TableRowSelection<FunctionTableType> = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setKeys(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      
    },
  };
  return (
    <Fragment>
      <Table
        className="user-not-in-group-table-container"
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

export default UserFunctionNotInGroup;
