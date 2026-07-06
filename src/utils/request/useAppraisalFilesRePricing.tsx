import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useAppraisalFilesRePricing = (
  params?: CommonGetAllParams,
  filter?: any
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/bussiness/api/v1/appraisalFiles/renewList?${serialize({
      ...params,
      ...filter,
    })}`,
    { refreshInterval: 30000 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
