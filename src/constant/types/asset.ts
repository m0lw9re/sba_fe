type AssetCommonType = {
  assetCommonId: number | null;
  appraisalFileId: string;
  assetCode: string;
  climsCode: string;
  assetLevelOneId: number;
  assetLevelTwoId: number;
  assetLevelThreeId: number;
  appraisalTypeId: number;
  legalStatusId: number;
  legalNumber: string;
  addressWard: string;
  addressDistrict: string;
  addressProvince: string;
};

type AssetLevelTwoType = {
  assetLevelTwoId: number;
  assetLevelTwoName: string;
  assetLevelOneId: number;
};

type AssetLevelOneType = {
  assetLevelOneId: number;
  assetLevelOneName: string;
  _short?: string;
};

type AssetLevelThreeType = {
  assetLevelThreeId: number;
  assetLevelThreeName: string;
  assetLevelTwoId: number;
  status: number;
};

type AssetType = {
  id: number;
  name: string;
};

type AppraisalTypeType = {
  appraisalTypeId: number;
  appraisalTypeName: string;
};

type LegalStatusType = {
  legalStatusId: number;
  legalStatusName: string;
  description: string;
};

type TreeAssetType = {
  key?: string;
  treeId: number | null;
  assetLandInforId: number | null | string;
  treeTypeId: number | null;
  treeDetail: string | null;
  yearOld: number | null;
  density: number | null;
  area: number | null;
  lossRate: number | null;
  amount: number | null;
  location: string | null;
};

type TreeAssetTypeType = {
  assetTreeTypeId: number;
  assetTreeTypeName: string;
  description: string | null;
};
type AssetMachineType = {
  assetCode: string;
  dataSourceId: string;
  contact: string;
  transactionStatus: string;
  transactionTime: string;
  assetImage: string;
  name: string;
  brand: string;
  model: string;
  yearMfg: string;
  countryMfgId: string;
  manufacturer: string;
  power: string;
  remainQuality: string;
  transactionPrice: string;
  estimatePrice: string;
};

type DescribeProjectType = {
  key?: string;
  detailDescribeId: number | null;
  assetLandInforId: string | number | null;
  categoryName: string | null;
  feature: string | null;
  area: string | null;
};

export type {
  AssetCommonType,
  AssetLevelOneType,
  AssetLevelThreeType,
  AssetLevelTwoType,
  LegalStatusType,
  AppraisalTypeType,
  TreeAssetType,
  TreeAssetTypeType,
  AssetMachineType,
  AssetType,
  DescribeProjectType,
};
