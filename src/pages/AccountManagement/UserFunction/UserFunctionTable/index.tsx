import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Card, Row, Space, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";
import UserFunctionInGroup from "pages/AccountManagement/UserFunction/UserFunctionTable/UserFunctionInGroup";
import UserFunctionNotInGroup from "pages/AccountManagement/UserFunction/UserFunctionTable/UserFunctionNotInGroup";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import TableCustom from "components/TableCustom";
import "pages/AccountManagement/UserFunction/UserFunctionTable/style.scss";
import { PermissionByRole } from "constant/types";
import { randomId } from "utils";
import { roleApi } from "apis/role";

type FunctionTableType = {
  key?: React.Key;
  functionCode: number;
  functionName: string;
  children?: Array<FunctionTableType>;
};

type Props = {
  filters: { roleCode?: string };
  permissionByRole: Array<PermissionByRole>;
  resetPermissionByRole: () => void;
  isLoading: boolean;
};

const UserFunctionTable: React.FC<Props> = ({
  filters,
  permissionByRole,
  isLoading,
  resetPermissionByRole,
}) => {
  const [permissionByRoleData, setPermissionByRoleData] = useState<
    PermissionByRole[]
  >([]);
  const [keysFunctionNotInGroup, setKeysFunctionNotInGroup] = useState<
    React.Key[]
  >([]);
  const [keysFunctionInGroup, setKeysFunctionInGroup] = useState<React.Key[]>(
    []
  );

  const getDatasource = (
    functionCode: number | null,
    functionName: string | null,
    key?: React.Key,
    children?: Array<FunctionTableType>
  ): FunctionTableType => {
    return {
      key,
      functionCode,
      functionName,
      children,
    } as FunctionTableType;
  };

  const userInGroup = permissionByRoleData.map((item) =>
    item?.permissions?.length > 0
      ? getDatasource(
          item.permissionGroupId,
          item.permissionGroupName,
          item.key,
          item.permissions
            .filter((el) => el.belongs === 1)
            .map((el) =>
              getDatasource(el.permissionId, el.description, el.key, undefined)
            )
        )
      : undefined
  );

  const userNotInGroup = permissionByRoleData.map((item) =>
    item?.permissions?.length > 0
      ? getDatasource(
          item.permissionGroupId,
          item.permissionGroupName,
          item.key,
          item.permissions
            .filter((el) => el.belongs === 0)
            .map((el) =>
              getDatasource(el.permissionId, el.description, el.key, undefined)
            )
        )
      : undefined
  );

  const addToGroup = () => {
    const newPermisionByRole = permissionByRoleData.map((item) => {
      return {
        ...item,
        permissions: item?.permissions?.map((itemSub) => {
          if (itemSub?.key) {
            const inList = keysFunctionNotInGroup.includes(itemSub.key);
            if (inList) {
              return {
                ...itemSub,
                belongs: 1,
              };
            } else return itemSub;
          } else
            return {
              ...itemSub,
              key: randomId(),
            };
        }),
      };
    });
    setKeysFunctionNotInGroup([]);
    setPermissionByRoleData(newPermisionByRole);
  };

  const moveOutGroup = () => {
    const newPermisionByRole = permissionByRoleData.map((item) => {
      return {
        ...item,
        permissions: item?.permissions?.map((itemSub) => {
          if (itemSub?.key) {
            const inList = keysFunctionInGroup.includes(itemSub.key);
            if (inList) {
              return {
                ...itemSub,
                belongs: 0,
              };
            } else return itemSub;
          } else
            return {
              ...itemSub,
              key: randomId(),
            };
        }),
      };
    });
    setKeysFunctionInGroup([]);
    setPermissionByRoleData(newPermisionByRole);
  };

  useEffect(() => {
    setPermissionByRoleData(
      permissionByRole?.map((item) => {
        return (
          {
            ...item,
            key: randomId(),
            permissions:
              item?.permissions?.map((itemSub: any) => {
                return {
                  ...itemSub,
                  key: randomId(),
                };
              }) || [],
          } || []
        );
      })
    );
  }, [permissionByRole]);

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "Chức năng không thuộc nhóm",
      dataIndex: "",
      width: "45%",
      render: () => (
        <div>
          <UserFunctionNotInGroup
            selectedKeys={keysFunctionNotInGroup}
            setKeys={setKeysFunctionNotInGroup}
            userNotInGroup={userNotInGroup}
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
            onClick={resetPermissionByRole}
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
      title: "Chức năng thuộc nhóm",
      dataIndex: "",
      width: "45%",
      render: () => (
        <div>
          <UserFunctionInGroup
            userInGroup={userInGroup}
            selectedKeys={keysFunctionInGroup}
            setKeys={setKeysFunctionInGroup}
          />
        </div>
      ),
    },
  ];

  const handleSave = async () => {
    if (filters?.roleCode && permissionByRoleData.length > 0) {
      try {
        const res = await roleApi.updatePermissionByRole(
          permissionByRoleData,
          filters.roleCode
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
    <div className="user-function-table-container">
      <Card className="card-container" size="small">
        <CardTitleCustomUpdate
          title="Phân quyền chức năng"
          saveFunction={handleSave}
        />
        <div style={{ width: "100" }} className="user-function-table">
          <TableCustom
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

export default UserFunctionTable;
