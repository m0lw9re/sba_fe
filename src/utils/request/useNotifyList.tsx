import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils";

export const useNotifyList = (params?: CommonGetAllParams) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/filestatushistory/getlistpaging?${serialize({
      ...params,
    })}`,
    {
      refreshInterval: 0,
    }
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
