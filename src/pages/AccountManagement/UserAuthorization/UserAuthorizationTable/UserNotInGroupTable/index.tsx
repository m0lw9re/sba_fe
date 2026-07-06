import React, { Fragment } from "react";
import { Table } from "antd";
import { defaultColumns } from "./config";
import "pages/AccountManagement/UserAuthorization/UserAuthorizationTable/UserNotInGroupTable/style.scss";
import { StaffByRoleType } from "constant/types";

type Props = {
  staffList: Array<StaffByRoleType>;
  setKeys: (keys: Array<React.Key>) => void;
  selectedKeys: Array<React.Key>;
};

const UserNotInGroupTable: React.FC<Props> = ({
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
        className="user-not-in-group-table-container"
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

export default UserNotInGroupTable;
