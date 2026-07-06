type RoleType = {
  roleName: string;
  roleId: string;
  whoCreate: string;
  dateCreate: number;
  dateModify: number;
  status: number;
  note: string;
};

type RoleGroupType = {
  roleCode: string;
  roleName: string;
  description: string | null;
};

type FilterRoleType = {
  keyword?: string;
  status?: number;
  start?: number;
  end?: number;
};

type FilterRoleFileType = {
  roleName?: string;
  roleId?: string;
  whoCreate?: string;
  dateCreate?: number;
  dateModify?: number;
  status?: number;
  note?: string;
};

export type { RoleType, FilterRoleType, FilterRoleFileType, RoleGroupType };
