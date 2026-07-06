import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsFollowDebt = (
  params?: CommonGetAllParams,
  filters?: any
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/debt/detail?${serialize({
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