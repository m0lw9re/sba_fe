type CategoryStaffPositionType = {
  positionId: string;
  positionName: string;
  term: string;
};

type CreateCategoryStaffPositionType = {
  positionId?: string | number;
  positionName?: string;
  term?: string;
};

type UpdateCategoryStaffPositionType = {
  positionId?: string | number;
  positionName?: string;
  term?: string;
};

type FilterCategoryStaffPositionType = {
  keyword?: string;
  isFiltering?: boolean;
};

export type {
  CategoryStaffPositionType,
  CreateCategoryStaffPositionType,
  FilterCategoryStaffPositionType,
  UpdateCategoryStaffPositionType,
};
