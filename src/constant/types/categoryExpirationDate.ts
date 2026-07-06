type CategoryExpirationDateType = {
  expirationDateId: number | null;
  assetLevelOneId: number | null;
  expirationDate: number | null;
};
type CreateUpdateCategoryExpirationDateType = {
  expirationDateId: number | null;
  assetLevelOneId: number | null;
  expirationDate: number | null;
};

type FilterCategoryExpirationDateType = {
  assetLevelOneId?: number | null;
  expirationDate?: number | null;
};

export type {
  CategoryExpirationDateType,
  CreateUpdateCategoryExpirationDateType,
  FilterCategoryExpirationDateType,
};
