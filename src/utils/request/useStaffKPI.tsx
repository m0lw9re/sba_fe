import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useStaffKPI = (
  params?: CommonGetAllParams,
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/staffs/search?${serialize({
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
