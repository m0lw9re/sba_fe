import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryDepartmentType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryDepartment = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryDepartmentType,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/departments?${serialize({
      ...params,
      ...filter,
    })}`,
    { refreshInterval: 0 },
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
