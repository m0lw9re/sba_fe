import { CommonGetAllParams } from "constants/types/common.type";
import { FilterReportAll } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReportsAll = (
  params?: CommonGetAllParams,
  filters?: any
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/reportSynthetic/combine?${serialize({
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
