import { FilterReportWeek } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsWeek = (
  filters?: FilterReportWeek
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/delay?${serialize({
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
