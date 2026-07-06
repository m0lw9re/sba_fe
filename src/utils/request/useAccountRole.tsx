import { CommonGetAllParams } from "constants/types/common.type";
import { FilterAccountRoleType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useAccountRole = (
  params?: CommonGetAllParams,
  filter?: FilterAccountRoleType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/roles?${serialize({
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
