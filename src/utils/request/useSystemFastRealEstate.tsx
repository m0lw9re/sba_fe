import {CommonGetAllParams} from "constants/types/common.type";
import useSWR from "swr";
import {serialize} from "utils/validate";

export const useSystemFast = (
  params?: CommonGetAllParams,
  filter?: {type?: number; assetType?: number}
) => {
  const {data, error, isLoading, mutate} = useSWR(
    `/assets/api/v1/storedAssetRate?${serialize({
      ...params,
      ...filter,
    })}`,
    {refreshInterval: 0}
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
