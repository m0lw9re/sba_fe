import "./style.scss";
import { Space } from "antd";
import { Fragment, memo } from "react";
import { CollapseCustom } from "components/CollapseCustom";
import ChangePasswordForm from "./ChangePasswordForm";

const ChangePassword = () => {
    return (
        <Fragment>
            <Space direction="vertical" size="middle" style={{ display: "flex" }}>
                <CollapseCustom
                    itemList={[
                        {
                            label: "Đổi mật khẩu",
                            children: <ChangePasswordForm account={{}}/>,
                        },
                        
                    ]}
                />
            </Space>
        </Fragment>
    );
}

export default memo(ChangePassword)