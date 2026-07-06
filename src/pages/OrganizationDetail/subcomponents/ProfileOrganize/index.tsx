import React, { useState } from "react";
import "pages/AccountDetail/subcomponents/Profile/style.scss";
import { Button, Row, Space, Tag, Typography } from "antd";
import { ReactComponent as Update } from "assets/images/svg/Update.svg";
import { Staff } from "constants/types/common.type";
import AccountInfo from "pages/AccountDetail/subcomponents/Profile/subcomponent/AccountInfo";
import UpdateAccount from "pages/AccountDetail/subcomponents/Profile/subcomponent/UpdateAccount";

export type AccountDataProps = {
  account: Staff;
};

const ProfileOrganize: React.FC<AccountDataProps> = ({ account }) => {
  const [tab, setTab] = useState("accountInfo");
  return (
    <div className="acc-profile-wrapper">
      <Row
        align={"middle"}
        className="acc-detail-header"
        style={{
          padding: "0 0 24px 0",
          borderBottom: "1px solid rgba(0, 0, 0, 0.07)",
        }}
        justify="space-between"
      >
        <Space
          direction="horizontal"
          wrap
          align="center"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography.Title
            level={4}
            className="acc-detail-header_title"
            style={{ margin: "0" }}
          >
            Thông tin tài khoản 1
          </Typography.Title>
          {tab === "accountInfo" ? (
            <>
              <Space>
                {account.status ? (
                  <Tag
                    color="rgba(67, 214, 133, 0.1)"
                    style={{
                      color: "#17A109",
                      borderRadius: "60px",
                      fontSize: "16px",
                      margin: "0 10px",
                      padding: "4px 12px",
                    }}
                  >
                    Đang hoạt động
                  </Tag>
                ) : (
                  <Tag
                    color="rgba(242, 91, 96, 0.1)"
                    style={{
                      color: "#F25B60",
                      borderRadius: "60px",
                      margin: "0 10px",
                      fontSize: "16px",
                      padding: "4px 12px",
                    }}
                  >
                    Tạm dừng
                  </Tag>
                )}
                <Button
                  icon={<Update />}
                  onClick={() => setTab("updateAccount")}
                />
              </Space>
            </>
          ) : (
            <>
              <Space size="small">
                <Button
                  size="large"
                  className="update-account_btn update-account_btn-cancel"
                  onClick={() => setTab("accountInfo")}
                >
                  Cancel
                </Button>
                <Button
                  size="large"
                  className="update-account_btn update-account_btn-save"
                >
                  Save
                </Button>
              </Space>
            </>
          )}
        </Space>
      </Row>
      <Row className="acc-detail-content acc_profile-content">
        {tab === "accountInfo" ? (
          <>
            <AccountInfo account={account}></AccountInfo>
          </>
        ) : (
          <>
            <UpdateAccount account={account} />
          </>
        )}
      </Row>
    </div>
  );
};

export default ProfileOrganize;
