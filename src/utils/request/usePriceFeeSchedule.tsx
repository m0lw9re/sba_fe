import { CommonGetAllParams } from "constants/types/common.type";
import { FilterCategoryFeeType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const usePriceFeeSchedule = (
  params?: CommonGetAllParams,
  filter?: FilterCategoryFeeType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    [
      `/bussiness/api/v1/feeSchedules?${serialize({
        ...params,
        ...filter,
      })}`,
      "POST",
    ],
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
