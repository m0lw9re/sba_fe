import { UploadFile } from "antd";

type GetAllCommonType = {
  page?: number;
  limit?: number;
  status?: number;
  direction?: number;
  totalElements?: number;
};

type DepartmentType = {
  departmentId: number;
  departmentName: string;
  departmentCode: string;
  address: string;
  dateCreate: string;
  dateModify: string;
};

type CompanyBranchType = {
  companyBranchId: number;
  companyBranchName: string;
  addressDetail: string;
  addressStreet: string;
  addressWard: string;
  addressDistrict: string;
  addressProvince: string;
  code: string;
};

type CurrentUseSituations = {
  currentUseSituationId: number;
  currentUseSituation: string;
  description: string;
};

type ProvincesInBranchType = {
  code: string;
  name: string;
  fullName: string;
  companyBranchCode: string | null;
};
type CompanyBranchAndRegionsType = {
  companyBranchId: number | string;
  companyBranchName: string;
  address: string;
  code: string;
  addressDetail: string;
  addressStreet: string;
  addressWard: string;
  addressWardName: string;
  addressDistrict: string;
  addressDistrictName: string;
  addressProvince: string;
  addressProvinceName: string;
  provincesBelong: ProvincesInBranchType[];
  provincesNotBelong: ProvincesInBranchType[];
};

type PositionType = {
  positionId: number;
  positionName: string;
};
type UploadProps = {
  image: UploadFile[],
  index: number;
}
type OptionType = {
  value: string | number;
  label: string;
}
type InfoSourceType = {
  infoSourceId: number | string;
  infoSourceName: string;
}
type CategoryCommonType = {
  id: number | string;
  name: string;
}
type RoadInPriceType = {
  roadInPriceRangeId: number | string;
  road: string;
}
type PositionInPriceRange = {
  positionInPriceRangeId: number | string;
  positionInPriceRangeName: string;
}
type AppraisalTypeType = {
  appraisalTypeId: number | string;
  appraisalTypeName: string;
}

export type {
  GetAllCommonType,
  DepartmentType,
  CompanyBranchType,
  PositionType,
  CompanyBranchAndRegionsType,
  ProvincesInBranchType,
  CurrentUseSituations,
  UploadProps,
  OptionType,
  InfoSourceType,
  CategoryCommonType,
  RoadInPriceType,
  PositionInPriceRange,
  AppraisalTypeType
};
