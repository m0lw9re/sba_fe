import { Dayjs } from "dayjs";

type CategoriesAdministrativesType = {
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  road?: string | null;
};
type FilterCategoriesAdministrativesType = {
  search?: string | null;
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  road?: string | null;
  isFiltering?: boolean;
};

type CategoriesBussinessFeeType = {
  feeBusinessId?: number | null;
  diemDi?: string | null;
  branchCode?: string | null;
  diemDen?: string | null;
  provinceCode?: string | null;
  businessFee?: number | null;
  whoCreate?: string | null;
  dateCreate?: string | null;
  dateModify?: string | null;
};
type FilterCategoriesBussinessFeeType = {
  keywword?: string | null;
  provinceCode?: string | null;
  branchCode?: string | null;
  isFiltering?: boolean;
};

type CategoryDayOffsType = {
  holidayInYearId?: string;
  holidayInYearName?: string;
  startDate?: string | Dayjs;
  endDate?: string | Dayjs;
  page?: number | string;
  limit?: number | string;
  direction?: number | string;
};

type CategoryDayOffsNote = {
  type?: string;
  content?: string;
};

type FiltersCategoryDayOffsType = {
  start: string | null;
  end: string | null;
  keyword?: string;
  isFiltering?: boolean;
};

type UsingPurposeType = {
  usingPurposeId: number | null;
  usingPurposeName: string | null;
  assetLevelTwoId: number;
};

type ConstructionType = {
  constructionTypeId: number | null;
  constructionTypeName: string | null;
  description: string | null;
};
type PositionType = {
  positionId: number | null;
  positionName: string | null;
};
type SacomUnitType = {
  code: string | null;
  unit: string | null;
};

type CategoryFeeType = {
  key?: string;
  feeScheduleId: number | null;
  assetLevelTwoId: number | null;
  fileBehaviorId: number | null;
  valueFrom: number | null;
  valueTo: number | null;
  feeTypeId: number | null;
  feeLevel: number | null;
  feeLevelPercent: number | null;
  feeLowest: number | null;
  feeHighest: number | null;
  appraisalTypeId: number | null;
  reduceLevel: number | null;
  dateCreate: string | null;
  assetLevelTwo: {
    assetLevelTwoId: number | null;
    assetLevelTwoName: string | null;
    assetLevelOneId: string | null;
    hibernateLazyInitializer: {};
  } | null;
  fileBehavior: {
    fileBehaviorId: number | null;
    fileBehaviorName: string | null;
    hibernateLazyInitializer: {};
  } | null;
  feeType: {
    feeTypeId: number | null;
    feeTypeName: string | null;
    hibernateLazyInitializer: {};
  } | null;
  appraisalType: {
    appraisalTypeId: number | null;
    appraisalTypeName: string | null;
    hibernateLazyInitializer: {};
  } | null;
};

type CategoryFeeCreateAndUpdateType = {
  key?: string;
  feeSchedule: number | null;
  assetLevelTwoId: number | null;
  fileBehaviorId: number | null;
  valueFrom: number | null;
  valueTo: number | null;
  feeLevelPercent: number | null;
  feeTypeId: number | null;
  feeLevel: number | null;
  feeLowest: number | null;
  feeHighest: number | null;
  appraisalTypeId: number | null;
  reduceLevel: number | null;
};

type FeeTypeType = {
  feeTypeId: number | null;
  feeTypeName: string | null;
};

type FilterCategoryFeeType = {
  keyword?: string;
  assetLevelTwoId?: number;
  fileBehaviorId?: number;
};
type BusinessAdvantageType = {
  name: string;
  id: number;
};
type LiquitiesType = {
  name: string;
  id: number;
};
type DataSourceType = {
  dataSourceName: string;
  dataSourceId: number;
};

type manufacturingCountryType = {
  id: number;
  iso: string;
  iso3: string;
  name: string;
  nicename: string;
  numcode: string;
  phonecode: string;
  vnName: string;
};

type KPIBonusCoefficientType = {
  id: string | null;
  type: string;
  kpiBonusCoefficient: number;
  fromDate: string | null;
  toDate: string | null;
  description: string | null;
  createDate: string | null;
  modifiedDate: string | null;
  createBy: string | null;
  modifiedBy: string | null;
};

type KPIBonusCoefficientCreateType = {
  id: string | null;
  type: string | null; // "1": ; "2":
  kpiBonusCoefficient: number | null;
  fromDate: string | null;
  toDate: string | null;
};

export type {
  FilterCategoriesAdministrativesType,
  CategoriesAdministrativesType,
  CategoriesBussinessFeeType,
  FilterCategoriesBussinessFeeType,
  CategoryDayOffsType,
  FiltersCategoryDayOffsType,
  UsingPurposeType,
  CategoryFeeType,
  FilterCategoryFeeType,
  FeeTypeType,
  CategoryFeeCreateAndUpdateType,
  CategoryDayOffsNote,
  PositionType,
  ConstructionType,
  SacomUnitType,
  BusinessAdvantageType,
  DataSourceType,
  LiquitiesType,
  manufacturingCountryType,
  KPIBonusCoefficientType,
  KPIBonusCoefficientCreateType,
};
