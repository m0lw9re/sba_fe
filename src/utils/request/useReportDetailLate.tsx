import { CommonGetAllParams } from "constants/types/common.type";
import { FilterReportDetailTotalLate } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsDetailLate = (
  params?: CommonGetAllParams,
  filters?: FilterReportDetailTotalLate
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/reportSynthetic/delay?${serialize({
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
