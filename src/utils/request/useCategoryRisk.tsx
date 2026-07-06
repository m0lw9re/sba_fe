import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryRiskType } from "constant/types/categoryrisk";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryRisk = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryRiskType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/riskAsset/searchRiskAsset?${serialize({
      ...params,
      ...filter,
    })}`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
