import { CommonGetAllParams } from "constants/types/common.type";
import { FilterAppraisalFileType } from "constants/types/appraisalFiles";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useRoles = (
  params?: CommonGetAllParams,
  filter?: FilterAppraisalFileType
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/api/v1/roles?${serialize({
      ...params,
      ...filter,
      limit: params?.limit || 9999,
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
