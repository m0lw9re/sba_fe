import useSWR from "swr";
import { serialize } from "utils/validate";
import { CommonGetAllParams } from "constants/types/common.type";

export const useListFeeSchedule = (
  params?: CommonGetAllParams,
  filter?: any
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/fee-schedule/find-all?${serialize({
      ...params,
      ...filter,
    })}`,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
