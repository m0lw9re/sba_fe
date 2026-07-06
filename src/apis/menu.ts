import { Menu } from "constants/types/menu.type";
import { SBAAxiosClient } from "./base";

export const menuApi = {
  getAll: () => {
    return SBAAxiosClient("/admin/api/v1/menus", {
      method: "GET",
    });
  },
  getByRoleCode: (roleCode: string) => {
    return SBAAxiosClient("/admin/api/v1/menu/findAllByOneRoleCode", {
      method: "GET",
      params: {
        roleCode,
      }
    });
  },
  updateByRoleCode: (roleCode: string, menus: Menu[]) => {
    return SBAAxiosClient("/admin/api/v1/menu/updateByOneRoleCode", {
      method: "POST",
      data: {
        roleCode,
        menus,
      }
    });
  },
};
