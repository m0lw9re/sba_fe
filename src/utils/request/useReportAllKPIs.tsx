import { FilterChartReportKPI } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportAllKPIS = (
  params?: CommonGetAllParams,
  filters?: FilterChartReportKPI,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v2/statistic/kpi_report?${serialize({
      ...filters,
      ...params,
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
