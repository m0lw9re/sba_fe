type DistrictsInArea = {
  key?: string;
  code: string;
  name: string;
  provinceCode: number;
  provinceName: string;
};

type AreaType = {
  key?: string;
  id: number;
  name: string;
  districtIds: Array<any>;
  inside: Array<DistrictsInArea>;
  outside: Array<DistrictsInArea>;
};

type FilterAreaSettingType = {
  areaOption?: number;
  provinceCode?: string;
  isFiltering?: boolean;
};

type ProvinceAreaType = {
  code: string;
  name: string;
  provinceCode: string;
  provinceName: string;
}

type AreaSettingByIdType = {
  id: number;
  name: string;
  isDefault: boolean;
  districtIds: Array<string>;
  inside: Array<ProvinceAreaType>;
  outsite: Array<ProvinceAreaType>;
}

export type { DistrictsInArea, AreaType, FilterAreaSettingType, AreaSettingByIdType };
