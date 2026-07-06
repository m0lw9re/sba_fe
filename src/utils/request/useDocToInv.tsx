import { CommonGetAllParams } from "constants/types/common.type";
import { FilterDocToInv } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useDocToInv = (
  params?: CommonGetAllParams,
  filters?: FilterDocToInv
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v2/statistic/can_export_bill_report?${serialize({
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
