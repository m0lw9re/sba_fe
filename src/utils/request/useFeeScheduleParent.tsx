import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useFeeScheduleParent = (
  params?: CommonGetAllParams,
  filter?: any
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/fee-schedule/parent`,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
