import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Layout, message, Modal, Row, Typography } from "antd";
import { AppDispatch, RootState } from "configs/configureStore";
import { logout } from "pages/App/store/appSlice";
import "pages/App/subcomponents/MainLayout/style.scss";
import HeaderLayout from "pages/App/subcomponents/MainLayout/subcomponents/HeaderLayout";
import SiderBarUpdate from "pages/App/subcomponents/MainLayout/subcomponents/SiderBar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { LOGIN } from "routes/route.constant";
import { getAccountStatus, getRoleAccount } from "utils/common";

const MainLayout = () => {
  const appState = useSelector((state: RootState) => state.appSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const handleLogout = () => {
    if (isAuthenticated) {
      instance.logout();
    }
    dispatch(logout());
    navigate(LOGIN);
    localStorage.clear();
    window.location.reload();
  };
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    handleCheckLogged();
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const handleCheckLogged = () => {
    if (!appState.isLogged) {
      navigate(LOGIN);
      message.warning("Vui lòng đăng nhập!");
      return;
    }

    const isAccountActive = getAccountStatus();
    if (!isAccountActive && isAccountActive !== null) {
      return Modal.error({
        title: "Thông báo",
        content: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ QTV!",
        okText: "Đăng xuất",
        onOk: () => {
          handleLogout();
        },
        className: "modal-error-login",
        closable: false,
        maskStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.5) !important",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        },
      });
    }

    const roles = getRoleAccount();
    if (roles?.length === 0 && roles !== null) {
      return Modal.error({
        title: "Thông báo",
        content: "Tài khoản chưa được thiết lập quyền. Vui lòng liên hệ QTV!",
        okText: "Đăng xuất",
        onOk: () => {
          handleLogout();
        },
        className: "modal-error-login",
        closable: false,
        maskStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.5) !important",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        },
      });
    }
  };

  return (
    <div className="main-layout-container">
      <Layout style={{ height: "100vh", display: "flex" }} hasSider={true}>
        {/* <Layout style={{ display: "flex" }}> */}
        <SiderBarUpdate />
        <Layout className="layout-container">
          <Row>
            <HeaderLayout />
          </Row>
          <Row className="content-wrapper">
            <Outlet />
          </Row>
          <Layout.Footer
            style={{
              textAlign: "end",
              padding: "0px 8px",
              paddingBottom: "20px",
            }}
          >
            <Typography className="text-footer">
              © {currentYear} Bản quyền thuộc về SACOMBANK
            </Typography>
          </Layout.Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
