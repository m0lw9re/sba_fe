import { FilterReportDebtMonthYear } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportWeekMonth = (
  params?: CommonGetAllParams,
  filters?: FilterReportDebtMonthYear
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/debt/report/month?${serialize({
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
