import { renderButtonName } from "constant/common";
import {
  ButtonPermissionType,
  Menu,
  MenuItemPermission,
} from "constants/types/menu.type";
import { getRoleAccount } from "./common";

const getButtonPermissionOfCurrentUser = (
  buttonCode: string,
  roleCodes?: string[]
): ButtonPermissionType[] => {
  const _roles = getRoleAccount() || [];
  const userRoles = roleCodes
    ? roleCodes
    : _roles.map((item) => item.replace("ROLE_", "")) || [];

  const result: ButtonPermissionType[] = [];
  buttonCode.split(";").forEach((item) => {
    const [role, buttonCodes] = item.split(":");
    if (userRoles.includes(role)) {
      buttonCodes.split(",").forEach((button) => {
        const [code, value] = button.split("-");
        result.push({
          code,
          label: renderButtonName(code),
          value: value === "true",
        });
      });
    }
  });
  return result;
};
const getButtonsPermissionInPage = (
  permissions: string,
  buttonsInPage: string[]
): MenuItemPermission[] => {
  const result: MenuItemPermission[] = [];
  if (!permissions) return result;
  // Split permissions by role
  permissions.split(";").forEach((permission) => {
    if (!permission) return;
    const [roleCode, buttonCodes] = permission.split(":");
    const buttonPermissions = buttonCodes.split(",").map((button) => {
      const [code, value] = button.split("-");
      return {
        code,
        label: renderButtonName(code),
        value: value === "true",
      };
    });

    // Find existing role or create a new one
    const existingRole = result.find((item) => item.roleCode === roleCode);
    if (existingRole) {
      existingRole.permissions.push(...buttonPermissions);
    } else {
      result.push({
        roleCode,
        permissions: buttonPermissions,
      });
    }
  });

  // Ensure all buttons in the page are included in the permissions
  result.forEach((rolePermission) => {
    buttonsInPage.forEach((buttonCode) => {
      if (
        !rolePermission.permissions.find(
          (permission) => permission.code === buttonCode
        )
      ) {
        rolePermission.permissions.push({
          code: buttonCode,
          label: renderButtonName(buttonCode),
          value: false,
        });
      }
    });
  });

  return result;
};
const getPermissionsOfMenu = (menus: Menu[], url: string) => {
  if (!url) return [];
  // recursive to flat menu
  const flatMenu: Menu[] = [];
  const recursive = (menu: Menu) => {
    flatMenu.push(menu);
    if (menu.menuDtos.length > 0) {
      menu.menuDtos.forEach((item) => {
        recursive(item);
      });
    }
  };
  menus.forEach((item) => {
    recursive(item);
  });

  const menu = flatMenu.find((item) => {
    let path = item.path;
    return url === path || url.startsWith(item.path || "");
  });
  const permissions: ButtonPermissionType[] = getButtonPermissionOfCurrentUser(
    menu?.permissions || ""
  );
  return permissions;
};
const isNotAllowed = (
  permissions: ButtonPermissionType[] | null,
  buttonCode: string
) => {
  if (!permissions) return true;
  let checkIsNotAllowed = true;
  const foundIndex = permissions?.findIndex(
    (item) => item.code === buttonCode && item.value
  );
  if (foundIndex !== -1) checkIsNotAllowed = false;

  return checkIsNotAllowed;
};

export {
  getButtonPermissionOfCurrentUser,
  getButtonsPermissionInPage,
  getPermissionsOfMenu,
  isNotAllowed,
};
