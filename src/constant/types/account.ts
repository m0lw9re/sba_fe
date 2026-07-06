type AccountType = {};

type CreateAccountType = {
  username?: string;
  password?: string;
  staffId?: string;
  roleId?: string;
  status: 0 | 1;
};

type FilterAccountType = {
  keyword?: string;
  status?: number;
  start?: number;
  end?: number;
};

export type { AccountType, CreateAccountType, FilterAccountType };
