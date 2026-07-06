import {
  Button,
  Image,
  Layout,
  Menu,
  MenuProps,
  Row,
  Skeleton,
  Typography,
} from "antd";
import Icons from "assets/icons";
import Logo from "assets/images/png/Sacombank_SBA_Nen_Xanh-02.png";
import { RootState } from "configs/configureStore";
import {
  setCurrentPagePermissions,
  setRedirectPage,
} from "configs/globalSlice";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { MenuType } from "constant/types";
import { setCollapse, setSelectedkeys } from "pages/App/store/appSlice";
import { iconsMenus } from "pages/App/subcomponents/MainLayout/subcomponents/SiderBar/config";
import "pages/App/subcomponents/MainLayout/subcomponents/SiderBar/style.scss";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getPermissionsOfMenu } from "utils/permission";
import { useMenu } from "utils/request";

type MenuItem = Required<MenuProps>["items"][number];

const { Sider } = Layout;

const SiderBar = () => {
  const appState = useSelector((state: RootState) => state.appSlice);

  const dispatch = useDispatch();
  const { currentPage } = useSelector((state: RootState) => state.globalSlice);
  const location = useLocation();

  const { pathname } = location;

  const { data, isLoading, error } = useMenu();

  const menuStorage = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY.MENUS) || "[]",
  );
  //   Lấy key selected khi reload lại trang
  useEffect(() => {
    menuStorage.forEach((item: MenuType) => {
      if (item.path === pathname) {
        dispatch(setSelectedkeys([item.menuId.toString()]));
        return;
      } else if (item.menuDtos?.length > 0 && item.menuId === 71) {
        item.menuDtos?.forEach((itemSub) => {
          if (itemSub.path === pathname && !(itemSub?.menuDtos.length > 0)) {
            dispatch(
              setSelectedkeys([
                item.menuId.toString(),
                itemSub.menuId.toString(),
              ]),
            );
          } else if (itemSub?.menuDtos.length > 0) {
            itemSub?.menuDtos.forEach((itemSubThree: MenuType) => {
              if (itemSubThree.path === pathname) {
                dispatch(
                  setSelectedkeys([
                    item.menuId.toString(),
                    itemSub.menuId.toString(),
                    itemSubThree.menuId.toString(),
                  ]),
                );
              }
            });
          }
        });
      } else if (item.menuDtos?.length > 0) {
        item.menuDtos?.forEach((itemSub) => {
          if (itemSub.path === pathname) {
            dispatch(
              setSelectedkeys([
                item.menuId.toString(),
                itemSub.menuId.toString(),
              ]),
            );
          }
        });
      }
    });
  }, [pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
    items.forEach((item: any) => {
      if (item?.key === e.key) {
        dispatch(setSelectedkeys([item.key]));
        return;
      } else if (item.children && item.key === "71") {
        item.children.forEach((subItem: any) => {
          if (subItem.key === e.key && !subItem.children) {
            dispatch(setSelectedkeys([item.key, subItem.key]));
          } else if (subItem.children) {
            subItem.children.forEach((subItemThree: any) => {
              if (subItemThree.key === e.key) {
                dispatch(
                  setSelectedkeys([item.key, subItem.key, subItemThree.key]),
                );
              }
            });
          }
        });
      } else if (item.children) {
        item.children.forEach((subItem: any) => {
          if (subItem.key === e.key) {
            dispatch(setSelectedkeys([item.key, subItem.key]));
          }
        });
      }
    });
  };

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group",
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };

  const menus =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.MENUS) || "[]").length ===
    0
      ? data.menu
      : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.MENUS) || "[]");

  const items: MenuItem[] = menus?.map((element: MenuType, index: number) =>
    getItem(
      element.path && !(element.menuDtos?.length !== 0) ? (
        <Link to={`${element.path}`}>{element.displayName}</Link>
      ) : (
        <div>{element.displayName}</div>
      ),
      element.menuId.toString(),
      element.displayIcon ? iconsMenus.get(element.displayIcon) : null,
      element.menuDtos?.length > 0
        ? element.menuDtos.map((el: MenuType) => {
            if (el.menuId === 1116) {
              return getItem(
                // el.path ? (
                //   <Link to={`${el.path}`}>{el.displayName}</Link>
                // ) : (
                <div>{el.displayName}</div>,
                // )
                el.menuId.toString(),
                null,
                el.menuDtos?.length > 0
                  ? el.menuDtos.map((elSub: MenuType) =>
                      getItem(
                        el.path ? (
                          <Link to={`${elSub.path}`}>{elSub.displayName}</Link>
                        ) : (
                          <div>{elSub.displayName}</div>
                        ),
                        elSub.menuId.toString(),
                      ),
                    )
                  : undefined,
              );
            } else {
              return getItem(
                el.path ? (
                  <Link to={`${el.path}`}>{el.displayName}</Link>
                ) : (
                  <div>{el.displayName}</div>
                ),
                el.menuId.toString(),
              );
            }
          })
        : undefined,
    ),
  );
  useEffect(() => {
    const pathName = location.pathname;
    if (pathName && pathName !== currentPage) {
      dispatch(setRedirectPage(pathName));
    }
  }, [location.pathname]);
  useEffect(() => {
    if (menus && menus?.length > 0) {
      const permissions =
        getPermissionsOfMenu(menus, location.pathname || "/") || [];
      dispatch(setCurrentPagePermissions(permissions));
    }
  }, [menus?.length, location.pathname]);

  return (
    <Sider
      className={appState.collapsed ? "sider unCollapsed-sider" : "sider"}
      collapsible
      theme="light"
      width={260}
      breakpoint="xl"
      collapsed={appState.collapsed}
      onCollapse={(boolean, type) => {
        dispatch(setCollapse(boolean));
      }}
    >
      {isLoading && menuStorage.length === 0 && data.menu.length === 0 ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Row
          align={"middle"}
          className="tittle-sider tittle-sider-logo"
          justify={!appState.collapsed ? "space-between" : "start"}
          style={{
            opacity: !appState.collapsed ? "1" : "0",
          }}
        >
          <Image
            preview={false}
            src={Logo}
            width={181}
            // height={32}
            alt="SBA Logo"
          />
          {!appState.collapsed ? (
            <Button
              type="text"
              shape="circle"
              onClick={() => {
                dispatch(setCollapse(!appState.collapsed));
              }}
              icon={
                <Icons.stepBackward
                  style={{ color: "#FFFFFF", fontSize: "18px" }}
                />
              }
            />
          ) : (
            <></>
          )}
        </Row>
      )}
      {appState.collapsed && (
        <Typography.Title
          className="tittle-sider"
          style={{
            fontFamily: "Roboto",
            fontSize: "24px",
            fontWeight: "500",
            color: "#fff",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          SBA
        </Typography.Title>
      )}
      <Menu
        mode="inline"
        inlineIndent={10}
        style={{
          marginTop: !appState.collapsed ? "65px" : "0",
        }}
        selectedKeys={appState.selectedKeys}
        items={items}
        onClick={onClick}
        className="sidebar-wraper"
      />
    </Sider>
  );
};

export default SiderBar;
