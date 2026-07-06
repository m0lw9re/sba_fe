import { FilterFollowDebtByStaff } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsFollowDGV = (
  params?: CommonGetAllParams,
  filters?: FilterFollowDebtByStaff
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness//api/v1/statistic/debt/bystaff?${serialize({
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
