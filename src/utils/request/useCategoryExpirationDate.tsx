import useSWR from "swr";
import { serialize } from "utils/validate";
import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryExpirationDateType } from "constant/types/categoryExpirationDate";

export const useCategoryExpirationDate = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryExpirationDateType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/expirationDate/getAll?${serialize({
      ...params,
      ...filter,
    })}`,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
