import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useListFunction = (
  params?: CommonGetAllParams,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/role/function?${serialize({
      ...params,
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
