type CategoryRiskType = {
  key?: number;
  riskContent: string;
  riskLevel: string;
};
type CreateCategoryRiskDataType = {
  riskAssetId: null | number;
  riskContent: string | null;
  assetLevelTwoId: number | null;
  description: string | null;
  riskLevel: number | null;
};

type FilterCategoryRiskType = {
  keyword?: string;
  riskLevel?: number;
  isFiltering?: boolean;
};

export type {
  CategoryRiskType,
  CreateCategoryRiskDataType,
  FilterCategoryRiskType,
};
