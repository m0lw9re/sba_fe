import { CommonGetAllParams } from "constants/types/common.type";
import { FilterAccountType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useAccounts = (
  params?: CommonGetAllParams,
  filter?: FilterAccountType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/staffs/search?${serialize({
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
