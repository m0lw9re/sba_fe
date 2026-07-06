type CategoryRegionsType = {
  key?: string;
  addressProvince: string | null;
  addressDistrict: string | null;
  addressWard: string | null;
  addressStreet: string | null;
  addressDetail: string | null;
  companyBranchName: string | null;
  code: string | null;
};

type CreateCategoryRegionsType = {
  addressProvince?: string | null;
  addressDistrict?: string | null;
  addressWard?: string | null;
  addressStreet?: string | null;
  addressDetail?: string | null;
  companyBranchName?: string | null;
  code?: string | null;
};

type EditCategoryRegionsType = {
  addressProvince?: string | null;
  addressDistrict?: string | null;
  addressWard?: string | null;
  addressStreet?: string | null;
  addressDetail?: string | null;
  companyBranchName?: string | null;
  code?: string | null;
  companyBranchId?: number | null;
};

type FilterCategoryRegionsType = {
  searchKey?: string;
  isFiltering?: boolean;
};

type BranchGroupType = {
  companyBranchId: number;
  companyBranchName: string;
};

export type {
  CategoryRegionsType,
  CreateCategoryRegionsType,
  FilterCategoryRegionsType,
  EditCategoryRegionsType,
  BranchGroupType,
};
