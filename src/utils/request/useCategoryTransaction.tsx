import { FilterCategoryTransactionType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useCategoryTransaction = (
  params?: CommonGetAllParams,
  filters?: FilterCategoryTransactionType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/branches/search?${serialize({
      ...params,
      ...filters,
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
