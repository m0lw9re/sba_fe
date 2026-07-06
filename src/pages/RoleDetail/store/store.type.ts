import { Staff } from "../../../constants/types/common.type";
import { PermissionGroup } from "../../../constants/types/permission.type";

export type GetDetailRoleSuccessPayload = {
    roleId: string;
    roleName: string;
    departmentId: string;
    departmentName: string;
    description: string;
    dateCreate: string;
    dateModify: string;
    status: number;
    permissionGroupDtos: Array<PermissionGroup>;
}

export type GetStaffListSuccess = {
    total: number;
    page: number;
    limit: number;
    data: Array<Staff>
}