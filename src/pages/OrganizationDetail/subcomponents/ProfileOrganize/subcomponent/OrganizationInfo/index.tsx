import React from "react";
import "pages/AccountDetail/subcomponents/Profile/subcomponent/AccountInfo/style.scss";
import { Avatar, Button, Space, Typography } from "antd";
import { ReactComponent as Upload } from "assets/images/svg/Upload.svg";
import Icon from '@ant-design/icons/lib/components/Icon';
import { Staff } from "constants/types/common.type";
import { formatDate } from "utils/date";

export type StaffDataProps = {
    account: Staff
}

const AccountInfo: React.FC<StaffDataProps> = ({ account }) => {
    return (
        <>
            <Space
                className="acc-detail-content_left"
                style={{ display: "block", position: "relative" }}
            >
                <Avatar shape="circle" src="" size={120} />
                <Button className="acc-uploadAva_btn">
                    <Icon
                        component={Upload}
                        className="account-uploadAva_icon"
                        style={{ fontSize: "24px", color: "transparent" }}
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
                    <li className='acc-detail-info_value'>
                        <Typography.Paragraph className='acc-detail-info_value-item'>{account.email || "Unknown"}</Typography.Paragraph>
                        <Typography.Paragraph className='acc-detail-info_value-item'>{account.staffName}</Typography.Paragraph>
                        <Typography.Paragraph className='acc-detail-info_value-item'>{formatDate(account.dateOfBirth)}</Typography.Paragraph>
                        <Typography.Paragraph className='acc-detail-info_value-item'>{account.phone || "Unknown"}</Typography.Paragraph>
                        <Typography.Paragraph className='acc-detail-info_value-item'>{account.roleName || "Unknown"}</Typography.Paragraph>
                    </li>
                </ul>
            </Space>
        </>
    );
};

export default AccountInfo;
