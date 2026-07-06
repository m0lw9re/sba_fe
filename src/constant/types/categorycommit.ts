type CreateCategoryCommit = {
  date: number | null;
  areaId: number | null;
  assetTypeId: number | null;
};

type EditCategoryCommit = {
  id?: number;
  date?: number;
  areaId?: number;
  assetTypeId?: number;
};

type FilterCategoryCommit = {
  keyword?: string;
  areaId?: number;
  assetTypeId?: number;
  isFiltering?: boolean;
};

type AreaType = {
  id: number | null;
  name: string;
  districtIds: Array<string>;
  inside: AreaInType[];
  outside: AreaInType[];
};

type AreaInType = {
  code: string;
  name: string;
  provinceCode: number | null;
  provinceName: string | null;
};

type OptionTypes = {
  value: string | number;
  label: string;
};

type FilterArea = {
  id?: number;
  provinceCode?: number;
  isFiltering?: boolean;
}

export type {
  CreateCategoryCommit,
  EditCategoryCommit,
  FilterCategoryCommit,
  AreaType,
  OptionTypes,
  AreaInType,
  FilterArea
};
