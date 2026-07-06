import { FilterHistoryAccessType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useHistoryAccess = (
  params?: CommonGetAllParams,
  filter?: FilterHistoryAccessType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/accessHistory/search?${serialize({
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
