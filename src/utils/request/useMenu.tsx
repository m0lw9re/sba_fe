import useSWR from "swr";
import {
  AccountTabSVG,
  PriceTabSVG,
  ProfileTabSVG,
  ReportTabSVG,
  RoleTabSVG,
  SettingTabSVG,
  StatisticTabSVG,
} from "assets/images";
import { LOCAL_STORAGE_KEY } from "constant/enums/index";

const iconsMenus = new Map();

iconsMenus.set("AccountSVG", <AccountTabSVG />);
iconsMenus.set("PriceSVG", <PriceTabSVG />);
iconsMenus.set("ProfileSVG", <ProfileTabSVG />);
iconsMenus.set("ReportSVG", <ReportTabSVG />);
iconsMenus.set("RoleSVG", <RoleTabSVG />);
iconsMenus.set("SettingSVG", <SettingTabSVG />);
iconsMenus.set("StaticSVG", <StatisticTabSVG />);

export const useMenu = () => {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(`/admin/api/v1/menu/compact`, { 
    refreshInterval: 0,
    revalidateOnFocus: false,
  });
  const menu = (response?.statusCodeValue === 200 && response) ? response?.body : [];

  Array.isArray(menu) &&
    localStorage.setItem(LOCAL_STORAGE_KEY.MENUS, JSON.stringify(menu));

  return {
    data: { menu },
    error: error,
    isLoading: isLoading,
    mutate: mutate,
  };
};
