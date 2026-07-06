import { Card, Divider, Row, Typography, Col, Space, Switch } from "antd";
import React from "react";
import "./style.scss";
import { PermissionGroup } from "constants/types/permission.type";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";

type Props = {
  permissionGroup?: PermissionGroup;
  changeStatusPermission: (value?: string) => void;
};

const RoleCommonCard: React.FC<Props> = ({
  permissionGroup,
  changeStatusPermission,
}) => {
  return (
    <Card className="role-management-card">
      <Row justify={"space-between"}>
        <CardTitleCustomUpdate title={permissionGroup?.permissionGroupName || ""}/> 
        <Switch defaultChecked size="small"/>
      </Row>
      <Divider />
      <Row gutter={[24, 4]}>
        {permissionGroup?.permissions?.map((item, index) => (
          <Col span={12} key={index}>
            <Space align="center" size="small">
              <Switch
                defaultChecked
                checked={item.status === 0 ? false : true}
                onChange={() => changeStatusPermission(item.permissionId)}
                size="small"
              />
              <Typography.Text className="role-description">
                {item.description}
              </Typography.Text>
            </Space>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default RoleCommonCard;
