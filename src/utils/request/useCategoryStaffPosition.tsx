import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryStaffPositionType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryStaffPosition = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryStaffPositionType,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/staffPositions/search?${serialize({
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
