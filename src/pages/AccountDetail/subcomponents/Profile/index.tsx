import React, { useRef, useState } from "react";
import "pages/AccountDetail/subcomponents/Profile/style.scss";
import { Button, Divider, Row, Space, Tag, Typography } from "antd";
import { ReactComponent as Update } from "assets/images/svg/Update.svg";
import AccountInfo from "pages/AccountDetail/subcomponents/Profile/subcomponent/AccountInfo";
import UpdateAccount, {
  PropsUpdateAccountRef,
} from "pages/AccountDetail/subcomponents/Profile/subcomponent/UpdateAccount";
import ButtonCustom from "components/ButtonCustom";

export type AccountDataProps = {
  account: any;
};

const Profile: React.FC<AccountDataProps> = ({ account }) => {
  const [tab, setTab] = useState("accountInfo");
  const btnUpdateRef = useRef<PropsUpdateAccountRef>(null);
  return (
    <Space
      className="acc-profile-wrapper"
      direction="vertical"
      style={{ padding: "8px" }}
      size={"small"}
    >
      <Row align={"middle"} justify="space-between">
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
          <Typography
            style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}
          >
            Thông tin tài khoản 1
          </Typography>
          {tab === "accountInfo" ? (
            <>
              <Space>
                {account.body.status ? (
                  <Tag
                    color="rgba(67, 214, 133, 0.1)"
                    style={{
                      color: "#17A109",
                      borderRadius: "60px",
                      fontSize: "14px",
                      margin: "0 10px",
                      padding: "4px 10px",
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
                      fontSize: "14px",
                      padding: "4px 10px",
                    }}
                  >
                    Tạm dừng
                  </Tag>
                )}
                <Button
                  icon={<Update />}
                  onClick={() => setTab("updateAccount")}
                  size="small"
                />
              </Space>
            </>
          ) : (
            <>
              <Space size="small">
                <ButtonCustom
                  onClick={() => setTab("accountInfo")}
                  label="Hủy"
                  size="small"
                />
                <ButtonCustom
                  onClick={() => btnUpdateRef.current?.hanldeUpdateAccount()}
                  label="Cập nhật"
                  type="primary"
                  size="small"
                />
              </Space>
            </>
          )}
        </Space>
      </Row>
      <Divider />
      <Row style={{ paddingTop: "8px" }}>
        {tab === "accountInfo" ? (
          <>
            <AccountInfo account={account}></AccountInfo>
          </>
        ) : (
          <>
            <UpdateAccount ref={btnUpdateRef} account={account.body} />
          </>
        )}
      </Row>
    </Space>
  );
};

export default Profile;
