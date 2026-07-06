import { Table } from "antd";
import React, { Fragment } from "react";
import { defaultColumns } from "./config";
import "pages/AccountManagement/UserAuthorization/UserAuthorizationTable/UserInGroupTable/style.scss";
import { StaffByRoleType } from "constant/types";

type Props = {
  staffList: Array<StaffByRoleType>;
  setKeys: (keys: Array<React.Key>) => void;
  selectedKeys: Array<React.Key>;
};

const UserInGroupTable: React.FC<Props> = ({
  staffList,
  setKeys,
  selectedKeys,
}) => {
  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: StaffByRoleType[]
    ) => {
      setKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: StaffByRoleType) => ({}),
  };
  return (
    <Fragment>
      <Table
        className="user-in-group-table-container"
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={defaultColumns}
        dataSource={staffList}
        bordered={true}
        pagination={false}
        scroll={{
          scrollToFirstRowOnChange: true,
          y: 450,
        }}
      />
    </Fragment>
  );
};

export default UserInGroupTable;
