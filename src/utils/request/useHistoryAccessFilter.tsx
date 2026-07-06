import { FilterHistoryAccessType } from "constant/types";
import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { formatDateFollowType } from "utils/date";
import { serialize } from "utils/validate";

export const useHistoryAccessFilter = (
  params?: CommonGetAllParams,
  filter?: FilterHistoryAccessType
) => {
  if (filter?.start) {
    const chooseDate = new Date(filter.start);
    const dd = formatDateFollowType(chooseDate, "YYYY-MM-DD HH:mm:ss.SSS");
    filter.start = dd;
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/accessHistory/search2?${serialize({
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
}