import { FilterReportCompletedFileTime } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsCompleteFileTime = (filter?: FilterReportCompletedFileTime) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/finish/time?${serialize({
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
