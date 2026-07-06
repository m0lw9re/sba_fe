type AccountRoleType = {
  roleCode: string;
  roleName: string;
};

type CreateAccoutRoleType = {
  roleCode?: string;
  roleName?: string;
};

type FilterAccountRoleType = {
  keyword?: string;
  isFiltering?: boolean;
};

export type { AccountRoleType, CreateAccoutRoleType, FilterAccountRoleType };
