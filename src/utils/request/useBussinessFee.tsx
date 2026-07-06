import useSWR from "swr";
import { serialize } from "utils/validate";
import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoriesBussinessFeeType } from "constant/types/categories";

export const useFeeBussiness = (
  params?: CommonGetAllParams,
  filter?: FilterCategoriesBussinessFeeType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/feeBusinesss/search?${serialize({
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
