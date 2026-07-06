type CreateCategoryInvest = {
  constructionTypeId?: string | null;
  constructionName?: string | null;
  lowPrice?: number | null;
  highPrice?: number | null;
  isHidden?: boolean;
};

type EditCategoryInvest = {
  constructionTypeId?: number;
  constructionTypeName?: string;
  constructionNameId?: number;
  constructionName?: string;
  lowPrice?: number;
  highPrice?: number;
  isHidden?: boolean;
};

type ConstructionTypeInvest = {
  constructionTypeId: string;
  constructionTypeName: string;
};

type FilterCategoryInvest = {
  keyword?: string;
  constructionTypeId?: number;
  constructionTypeName?: string;
  isFiltering?: boolean;
  isActive?: boolean;
};

type FilterCategoryConstruction = {
  keyword?: string;
  isFiltering?: boolean;
  isActive?: string | null;
};

type CreateCategoryConstruction = {
  constructionTypeName?: string | null;
  hidden?: boolean;
};

type EditCategoryConstruction = {
  constructionTypeId?: number | null;
  constructionTypeName?: string | null;
  hidden?: boolean;
  description?: string | null;
};

export type {
  CreateCategoryInvest,
  EditCategoryInvest,
  ConstructionTypeInvest,
  FilterCategoryInvest,
  FilterCategoryConstruction,
  CreateCategoryConstruction,
  EditCategoryConstruction,
};
