export type Menu = {
    menuId: number;
    displayName: string;
    displayIcon?: string;
    path?: string;
    menuLevel: number;
    parentMenu: number;
    sequence: number;
    description: string;
    roleIds: string;
    whoCreate: string;
    menuDtos: Array<Menu>;
    key?: string | number;
    isBelong: boolean;
    isShow: number; // 0: hide, 1: show
    // xuat_BBKS,xuat_TT
    buttonCodes: string;
    // CVTD:xuat_BBKS-true,xuat_TT-false;ADMIN:xuat_BBKS-false,xuat_TT-false
    permissions: string;
}
export type MenuItemPermission = {
    roleCode: string;
    permissions: ButtonPermissionType[];
}
export type ButtonPermissionType = {
    code: string;
    label: string;
    value: boolean;
};