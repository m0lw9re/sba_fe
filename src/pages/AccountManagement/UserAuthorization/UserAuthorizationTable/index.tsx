import { Card, Row, Space, message } from "antd";
import { ColumnsType } from "antd/es/table";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import React, { useEffect, useState } from "react";
import Icons from "assets/icons";
import TableCustom from "components/TableCustom";
import UserInGroupTable from "pages/AccountManagement/UserAuthorization/UserAuthorizationTable/UserInGroupTable";
import UserNotInGroupTable from "pages/AccountManagement/UserAuthorization/UserAuthorizationTable/UserNotInGroupTable";
import "pages/AccountManagement/UserAuthorization/UserAuthorizationTable/style.scss";
import { StaffByRoleType } from "constant/types";
import { randomId } from "utils";
import { StaffApi } from "apis/staff";
import { BUTTON_CODES } from "constant/common";

type Props = {
  role_code: string | null;
  staffList: Array<StaffByRoleType>;
  resetStaffList: () => void;
  isLoading: boolean;
};

const UserAuthorizationTable: React.FC<Props> = ({
  role_code,
  staffList,
  resetStaffList,
  isLoading,
}) => {
  const [staffListData, setStaffListData] = useState<Array<StaffByRoleType>>(
    []
  );
  const [keysStaffNotInGroup, setKeysStaffNotInGroup] = useState<React.Key[]>(
    []
  );
  const [keysStaffInGroup, setKeysStaffInGroup] = useState<React.Key[]>([]);

  useEffect(() => {
    if (staffList) {
      setStaffListData(
        staffList?.map((item) => {
          return {
            ...item,
            key: randomId(),
          };
        })
      );
    }
  }, [staffList]);

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "Thành viên không thuộc nhóm",
      width: "48%",
      dataIndex: "",
      render: () => (
        <div
          style={{
            maxHeight: "100%",
            height: "100%",
            width: "100%",
            verticalAlign: "top",
          }}
        >
          <UserNotInGroupTable
            selectedKeys={keysStaffNotInGroup}
            setKeys={setKeysStaffNotInGroup}
            staffList={staffListData.filter((item) => item.belongs === 0)}
          />
        </div>
      ),
    },
    {
      key: 2,
      align: "center",
      title: (
        <Row justify={"center"}>
          <ButtonCustom
            bgColor="#2862AF"
            size={"small"}
            type="primary"
            onClick={resetStaffList}
            icon={<Icons.sync />}
          />
        </Row>
      ),
      dataIndex: "",
      render: () => (
        <Row align={"middle"} justify={"center"}>
          <Space direction="vertical">
            <ButtonCustom
              bgColor="#17A109"
              size="small"
              shape="circle"
              onClick={addToGroup}
              icon={<Icons.doubleRight style={{ color: "#FFFFFF" }} />}
            />
            <ButtonCustom
              bgColor="#F25B60"
              size="small"
              shape="circle"
              onClick={moveOutGroup}
              icon={<Icons.doubleLeft style={{ color: "#FFFFFF" }} />}
            />
          </Space>
        </Row>
      ),
    },
    {
      key: 3,
      title: "Thành viên thuộc nhóm",
      dataIndex: "",
      width: "48%",
      render: () => (
        <div style={{ maxHeight: "100%", height: "100%", width: "100%" }}>
          <UserInGroupTable
            selectedKeys={keysStaffInGroup}
            setKeys={setKeysStaffInGroup}
            staffList={staffListData.filter((item) => item.belongs === 1)}
          />
        </div>
      ),
    },
  ];

  const addToGroup = () => {
    const newStaffList = staffListData.map((item) => {
      if (item?.key) {
        const inList = keysStaffNotInGroup.includes(item.key);
        if (inList) {
          return {
            ...item,
            belongs: 1,
          };
        } else
          return {
            ...item,
          };
      }
      return {
        ...item,
        key: randomId(),
      };
    });
    setKeysStaffNotInGroup([]);
    setStaffListData(newStaffList);
  };

  const moveOutGroup = () => {
    const newStaffList = staffListData.map((item) => {
      if (item?.key) {
        const inList = keysStaffInGroup.includes(item.key);
        if (inList) {
          return {
            ...item,
            belongs: 0,
          };
        } else
          return {
            ...item,
          };
      }
      return {
        ...item,
        key: randomId(),
      };
    });
    setKeysStaffInGroup([]);
    setStaffListData(newStaffList);
  };

  const handleSave = async () => {
    if (role_code && staffListData.length > 0) {
      try {
        const res = await StaffApi.updateStaffListByRole(
          staffListData,
          role_code
        );
        if (res.data.code === 200) {
          message.success(res.data.message);
        } else message.error(res.data.message);
      } catch {
        message.error("Cập nhật thất bại");
      }
    }
  };

  return (
    <div className="user-authorization-table-container">
      <Card className="card-container" size="small">
        <CardTitleCustomUpdate
          title="Phân quyền tài khoản"
          saveFunction={handleSave}
          saveButtonCode={BUTTON_CODES.pqtk_luu}
        />
        <div style={{ width: "100%" }} className="user-authorization-table">
          <TableCustom
            loading={isLoading}
            dataSource={[{}]}
            columns={columns}
            bordered={true}
            isLoading={isLoading}
            limit={0}
            total={0}
            onLimitChange={() => {}}
            onPageChange={() => {}}
            page={1}
          />
        </div>
      </Card>
    </div>
  );
};

export default UserAuthorizationTable;
