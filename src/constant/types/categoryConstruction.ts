type CategoryConstructionType = {
  key?: number;
  constructionNameId: number;
  constructionName: string;
  constructionTypeId: number;
  constructionTypeName: string;
  lowPrice: number;
  highPrice: number;
};
type CreateCategoryConstructionDataType = {
  constructionName: string;
  constructionTypeId: number | null;
  lowPrice: number | null;
  highPrice: number | null;
};

type FilterCategoryConstructionType = {
  keyword?: string;
  constructionTypeId?: number;
  isFiltering?: boolean;
};

export type {
  CategoryConstructionType,
  CreateCategoryConstructionDataType,
  FilterCategoryConstructionType,
};
