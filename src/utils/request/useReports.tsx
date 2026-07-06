import { CommonGetAllParams } from "constants/types/common.type";
import { FilterReportType } from "constants/types/report.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useReports = (
  params?: CommonGetAllParams,
  filter?: FilterReportType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `url?${serialize({
      ...params,
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
