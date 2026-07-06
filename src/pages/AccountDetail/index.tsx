import { Row, Space, Typography, Avatar, Menu, Col } from "antd";
import { ReactComponent as UserCircle } from "assets/images/svg/UserCircle.svg";
import { ReactComponent as Banned } from "assets/images/svg/Banned.svg";
import { ReactComponent as Restore } from "assets/images/svg/Restore.svg";
import { ReactComponent as LockOutLine } from "assets/images/svg/LockOutLine.svg";
import React, { ReactNode, useEffect, useState } from "react";
import "./style.scss";
import { useParams } from "react-router-dom";
import Profile from "pages/AccountDetail/subcomponents/Profile";
import ChangePassword from "pages/AccountDetail/subcomponents/ChangePassword";
import { useAccountDetail } from "utils/request";
import ChangeStatusAccountModal from "./subcomponents/ModalChangeStatusAccount";
import { ACCOUNT, ACCOUNT_DETAIL } from "routes/route.constant";
import { useDispatch } from "react-redux";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import ComponentsError from "pages/ComponentsError";

type MenuItem = {
  title: string;
  key: string;
  icon?: ReactNode;
};

const menudata: Array<MenuItem> = [
  {
    title: "Tài khoản",
    key: "account",
    icon: <UserCircle />,
  },
  {
    title: "Đổi mật khẩu",
    key: "changepass",
    icon: <LockOutLine />,
  },
];
const AccountDetail: React.FC = () => {
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [action, setAction] = useState("ban");
  const [tab, setTab] = useState("account");
  const { username } = useParams();
  const dispatch = useDispatch();
  const {
    data: accDetail,
    isLoading,
    error,
    mutate,
  }: {
    data: any;
    isLoading: boolean;
    error: any;
    mutate: () => void;
  } = useAccountDetail(username || "");

  const closeChangeStatusAccountModal = () => {
    mutate();
    setIsOpenModalConfirm(false);
  };
  const confirmBan = () => {
    setIsOpenModalConfirm(true);
    setAction("ban");
  };
  const confirmActive = () => {
    setIsOpenModalConfirm(true);
    setAction("active");
  };
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách tài khoản",
        path: ACCOUNT,
      },
      {
        label: "Chi tiết tài khoản",
        path: ACCOUNT_DETAIL.replace(":username", String(username)),
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [username, ACCOUNT, ACCOUNT_DETAIL])

  if (!accDetail && isLoading) return <div>Loading</div>;
  if (error) return <ComponentsError />;
  return (
    <div className="page-container">
      <ChangeStatusAccountModal isOpenModal={isOpenModalConfirm} closeModal={closeChangeStatusAccountModal} action={action} account={accDetail} />
      <Row gutter={[8, 4]}>
        <Col span={6}>
          <Space
            direction="vertical"
            className="acc-detail-menu"
            style={{padding: "8px"}}
          >
            <Space size="small">
              <Avatar
                shape="circle"
                src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                size={60}
              />
              <div>
                <CardTitleCustomUpdate title={accDetail.body.staffName || "Unkown"} />
                <Typography
                  style={{
                    fontSize: "14px",
                    margin: "0",
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  {accDetail.body.roleName || "Unkown"}
                </Typography>
              </div>
            </Space>
            <Row className="w-100 menuTab">
              <Menu
                mode="inline"
                inlineIndent={10}
                defaultSelectedKeys={["account"]}
              >
                {menudata.map((menu) => (
                  <Menu.Item
                    key={menu.key}
                    icon={menu.icon}
                    onClick={() => {
                      setTab(menu.key);
                    }}
                  >
                    {menu.title}
                  </Menu.Item>
                ))}
                {accDetail.body.status ? (
                  <Menu.Item
                    key={"ban"}
                    icon={<Banned />}
                    onClick={confirmBan}
                    className="acc-ban"
                  >
                    Tạm dừng
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key={"unban"}
                    icon={<Restore />}
                    onClick={confirmActive}
                    className="acc-unban"
                  >
                    Khôi phục
                  </Menu.Item>
                )}
              </Menu>
            </Row>
          </Space>
        </Col>
        <Col span={18}>
          <div style={{ width: "100%" }}>
            {tab === "account" ? (
              <Profile account={accDetail}></Profile>
            ) : (
              <ChangePassword account={accDetail}></ChangePassword>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AccountDetail;
