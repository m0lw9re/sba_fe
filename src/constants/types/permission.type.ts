export type Permission = {
    permissionId?: string;
    name?: string;
    permissionGroupId?: string;
    permissionGroupName?: string;
    description?: string;
    status?: number;
}

export type PermissionGroup ={
    permissionGroupId: string;
    permissionGroupName: string;
    description: string;
    permissions: Array<Permission>;
}



