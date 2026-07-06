import React, { useState } from "react";
import { Row, Col, Space, Typography, Button, Dropdown, Image } from "antd";
import "pages/App/subcomponents/MainLayout/subcomponents/HeaderLayout/style.scss";
import Icons from "assets/icons";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "pages/App/store/appSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "configs/configureStore";
import BreadcrumbCustom from "components/BreadcrumbCustom";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import backgroundImageLeftSide from "assets/images/png/9.png";
import { LOGIN } from "routes/route.constant";
import { Bell } from "../Bell";
import { NotificationList } from "../NotificationList";
import authApi from "apis/auth";

const HeaderLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [showNotiClass, setShowNotiClass] =
    useState<string>("notify-list-hide");
  const username = String(localStorage.getItem(LOCAL_STORAGE_KEY.USERNAME));
  const appStateRedux = useSelector((state: RootState) => state.appSlice);
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  if (!username) {
    navigate(LOGIN);
  }

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        instance.logout();
      }
      await authApi.logout();
      dispatch(logout());
      localStorage.clear();
      navigate(LOGIN);
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const accountDetail = (tab: string) => {
    navigate(`/account-detail`, {
      state: { tab },
    });
  };

  const action: MenuProps["items"] = [
    {
      key: "detail",
      label: (
        <Space onClick={() => accountDetail("detail")}>
          <Icons.user />
          <Typography className="header-accountAction">
            Chi tiết tài khoản
          </Typography>
        </Space>
      ),
    },
    {
      key: "logout",
      label: (
        <Space onClick={handleLogout} style={{ width: "100%" }}>
          <Icons.logout />
          <Typography className="header-accountAction">Đăng xuất</Typography>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="header-container w-100">
        <Row className="w-100 h-100" justify={"space-between"} align={"middle"}>
          <Col>
            <Typography.Text className="title-header">
              HỆ THỐNG PHẦN MỀM THẨM ĐỊNH GIÁ - SACOMBANK
            </Typography.Text>
            <BreadcrumbCustom _items={appStateRedux.breadCrumb} />
          </Col>
          <Col>
            <Space className="infoUserHeader" size={"large"}>
              <Bell
                onClick={() => {
                  if (showNotiClass === "notify-list-hide") {
                    setShowNotiClass("notify-list-show");
                  }
                  if (showNotiClass === "notify-list-show") {
                    setShowNotiClass("notify-list-hide");
                  }
                }}
              />
              {/* <Button
                shape="circle"
                className="beside-account"
                icon={<Icons.setting />}
              /> */}
              <Space size={"small"}>
                {/* <Typography className="account-name">{username}</Typography> */}
                <Dropdown
                  menu={{ items: action }}
                  trigger={["click"]}
                  placement="bottomLeft"
                >
                  <Button
                    shape="circle"
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0",
                      border: "none",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      display: "flex",
                    }}
                  >
                    <Typography className="account-name">{username}</Typography>
                    <Image
                      src={backgroundImageLeftSide}
                      style={{ width: "30px", height: "30px" }}
                      preview={false}
                      fallback="data:image/png;base64,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"
                    />
                  </Button>
                </Dropdown>
              </Space>
            </Space>
          </Col>
        </Row>
        <div className={`${showNotiClass}`}>
          <NotificationList setShowNotiClass={setShowNotiClass} />
        </div>
      </div>
    </>
  );
};

export default HeaderLayout;
