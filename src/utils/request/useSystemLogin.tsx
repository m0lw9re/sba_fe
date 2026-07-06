import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";
import { FilterSystemLoginType } from "constant/types/system";

export const useSystemLogin = (
  params?: CommonGetAllParams,
  filter?: FilterSystemLoginType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${"/admin/api/v1/accessHistory/getAll?"}${serialize({
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
