import { FilterReportFileComplete } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportCompleteFile = (filter?: FilterReportFileComplete) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/finish/dashboard?${serialize({
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
