type SystemLoginType = {
  accessHistoryId: number;
  staffId: string;
  companyBranchName: string | null;
  username: string | null;
  loginTime: string | null;
  signoutTime: string | null;
  updateTime: string | null;
  ipAddress: string | null;
  clientInfo: string | null;
  accessHistoryToken: string | null;
  status: number;
};
type FilterSystemLoginType = {
  start?: number | null | string;
  end?: number | null | string;
  keyword?: string | null;
  staffId?: string | null;
  isFiltering?: boolean;
};

type SystemParamsType = {
  id?: number;
  systemParametersGroupId?: number;
  systemParametersName?: string | null;
  systemParametersGroupName?: string | null;
  value?: string | null;
};

type FilterSystemParamsType = {
  groups?: number | null;
  type?: number | null;
  keyword?: string | null;
  isFiltering?: boolean;
};

type SystemFastExpertiseRealEstate = {
  id?: number;
  type?: number | null;
  typeName?: string | null;
  rateId?: number | null;
  rateName?: string | null;
  ratePerMain?: number | null;
  description?: string | null;
  assetType?: number | null;
};

type UtilityType = {
  id: string;
};

type UtilityComboType = {};

type CreateUtilityType = { name: string; utilityIds: string[]; rate: number };

type UpdateUtilityType = {
  id: string;
  name: string;
  utilityIds: string[];
  rate: number;
};

export type {
  SystemLoginType,
  FilterSystemLoginType,
  SystemParamsType,
  FilterSystemParamsType,
  SystemFastExpertiseRealEstate,
  UtilityType,
  UtilityComboType,
  CreateUtilityType,
  UpdateUtilityType,
};
