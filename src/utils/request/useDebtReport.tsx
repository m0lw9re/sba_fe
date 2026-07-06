import { FilterReportCompletedFileTime } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useDebtReport = (filter?: FilterReportCompletedFileTime) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/debt/report?${serialize({
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
