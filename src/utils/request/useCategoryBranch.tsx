import { FilterCategoryRegionsType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryBranch = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryRegionsType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/companyBranch/search?${serialize({
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
