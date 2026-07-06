import { FilterTotalReportDebt } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsTotalDebt = (
  filters?: FilterTotalReportDebt
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/debt?${serialize({
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
