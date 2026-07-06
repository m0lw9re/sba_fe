import React from "react";
import { Button, Card, Divider, Row, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState } from "configs/configureStore";
import RoleCommonCard from "./subcomponents/RoleCommonCard";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";

type Props = {
  changeOpenEdit: () => void;
};

const RoleSettingCard: React.FC<Props> = ({ changeOpenEdit }) => {
  const roleDetailState = useSelector(
    (state: RootState) => state.roleDetailSlice
  );
  return (
    <Card
      loading={roleDetailState.isLoadingGetDetail}
      className="roleSetting-card-wrapper"
      style={{ padding: "8px" }}
      size="small"
    >
      <Row justify={"space-between"}>
        <CardTitleCustomUpdate title="Phân quyền" />
        <Space>
          <Button
            onClick={changeOpenEdit}
            size="small"
            className="btn-role-edit"
          >
            Hiện
          </Button>
          <Button icon={<DownOutlined />} size="small" />
        </Space>
      </Row>
      <Divider />
      <Space direction="vertical" size="small">
        {roleDetailState?.permissionGroupDtos?.map((item, index) => (
          <RoleCommonCard permissionGroup={item} key={index} />
        ))}
      </Space>
    </Card>
  );
};

export default RoleSettingCard;
