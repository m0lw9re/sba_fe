import { CommonGetAllParams } from "constants/types/common.type";
import { FilterReportCompletedFileDetail } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsDetailCompleteFile = (
  params?: CommonGetAllParams,
  filters?: FilterReportCompletedFileDetail
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/statistic/finish/detail?${serialize({
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
