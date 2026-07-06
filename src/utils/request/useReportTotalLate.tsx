import { FilterReportTotalLate } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsTotalLate = (
  filters?: FilterReportTotalLate
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/delay/report?${serialize({
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
