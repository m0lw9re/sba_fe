import { Card, Row, Typography, Col, Space, Switch } from "antd";
import React from "react";
import "./style.scss";
import { PermissionGroup } from "constants/types/permission.type";

type Props = {
  permissionGroup?: PermissionGroup;
  changeStatusPermission: (value?: string) => void;
};

const RoleCommonCard: React.FC<Props> = ({
  permissionGroup,
  changeStatusPermission,
}) => {
  return (
    <Card className="roleAccount-card">
      <Space>
        <Switch defaultChecked size="small" />
        <Typography.Text style={{fontWeight: "bold"}}>{permissionGroup?.permissionGroupName || ""}</Typography.Text>
      </Space>
      <Row gutter={[24, 4]}>
        {permissionGroup?.permissions?.map((item, index) => (
          <Col span={6} key={index}>
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
