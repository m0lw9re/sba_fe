type ContructionTypeType = {
  constructionTypeId: number;
  constructionTypeName: string;
  description: string | null;
};
type ConstructionLegalTypeType = {
  id: number;
  name: string;
};

type ContructionNameType = {
  constructionNameId: number | null;
  constructionName: string | null;
  constructionTypeId: number | null;
  lowPrice: number | null;
  highPrice: number | null;
};

type ConstructionType = {
  key?: string;
  constructionTypeId: number | null;
  assetLandInforId: number | null | string;
  constructionNameId: number | null;
  constructionArea: number | null;
  constructionLegalTypeId: number | null;
  floors: number | null;
  baseFloors: number | null;
  furnitures: string | null;
  constructionYear: number | null;
  repairYear: number | null;
  remainingQuality: number | null;
  mdht: number | null;
  describe: string | null;
  whoCreate: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  orderBy?: number;
};

type ConstructionProjectType = {
  key?: string;
  constructionId: number | null;
  assetLandInforId: number | null;
  constructionTypeName: string | null;
  constructionName: string | null;
  constructionArea: number | null;
  constructionLegalTypeId: number | null;
  floors: number | null;
  baseFloors: number | null;
  furnitures: string | null;
  constructionYear: number | null;
  repairYear: string | null;
  remainingQuality: number | null;
  mdht: number | null;
  totalValue: number | null;
  unitPrice: number | null;
  describe: string | null;
  whoCreate: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  orderBy?: number;
};

export type {
  ContructionNameType,
  ContructionTypeType,
  ConstructionType,
  ConstructionLegalTypeType,
  ConstructionProjectType,
};
