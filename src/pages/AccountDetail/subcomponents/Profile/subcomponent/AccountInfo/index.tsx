import React from "react";
import { Avatar, Button, Space, Typography } from "antd";
import { ReactComponent as Upload } from "assets/images/svg/Upload.svg";
import Icon from "@ant-design/icons/lib/components/Icon";
import "./style.scss";
import { formatDate } from "utils/date";

export type StaffDataProps = {
  account: any;
};

const AccountInfo: React.FC<StaffDataProps> = ({ account }) => {

  return (
    <>
      <Space
        className="acc-detail-content_left"
        style={{ display: "block", position: "relative" }}
      >
        <Avatar shape="circle" src="" size={120} />
        <Button className="acc-uploadAva_btn" size="small">
          <Icon
            component={Upload}
            className="account-uploadAva_icon"
            style={{ color: "transparent" }}
          />
        </Button>
      </Space>
      <Space direction="vertical" className="acc-detail-content_rigth">
        <ul className="acc-detail-info">
          <li className="acc-detail-info_lable">
            <Typography.Paragraph className="acc-detail-info_lable-item">
              Email
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_lable-item">
              Họ tên
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_lable-item">
              Ngày sinh
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_lable-item">
              Số điện thoại
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_lable-item">
              Vai trò
            </Typography.Paragraph>
          </li>
          <li className="acc-detail-info_value">
            <Typography.Paragraph className="acc-detail-info_value-item">
              {account.body.email || "Unknown"}
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_value-item">
              {account.body.staffName}
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_value-item">
              {formatDate(account.body.dateOfBirth)}
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_value-item">
              {account.body.phone || "Unknown"}
            </Typography.Paragraph>
            <Typography.Paragraph className="acc-detail-info_value-item">
              {account.body.professionalTitle || "Unknown"}
            </Typography.Paragraph>
          </li>
        </ul>
      </Space>
    </>
  );
};

export default AccountInfo;
