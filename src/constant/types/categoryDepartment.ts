type CategoryDepartmentType = {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
};

type CreateCategoryDepartmentType = {
  departmentId?: string | number;
  departmentName?: string;
  departmentCode?: string;
};

type UpdateCategoryDepartmentType = {
  departmentId?: string | number;
  departmentName?: string;
  departmentCode?: string;
};

type FilterCategoryDepartmentType = {
  keyword?: string;
  isFiltering?: boolean;
};

export type {
  CategoryDepartmentType,
  CreateCategoryDepartmentType,
  FilterCategoryDepartmentType,
  UpdateCategoryDepartmentType,
};
