import { CommonGetAllParams } from "constants/types/common.type";
import { FilterReportDetailWeek } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsDetailWeek = (
  params?: CommonGetAllParams,
  filters?: FilterReportDetailWeek
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/reportSynthetic/weekDetail?${serialize({
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
