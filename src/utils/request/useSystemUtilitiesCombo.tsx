import { CommonGetAllParams } from "constants/types/common.type";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useSystemUtilitiesCombo = (params?: CommonGetAllParams) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/apartment/detail/combo?${serialize({
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
