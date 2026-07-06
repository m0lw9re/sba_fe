import { GetAllCommonType } from "constant/types";
import useSWR from "swr";
import { serialize } from "utils/validate";

export const useStoredAssetLandEstates = (
  params: GetAllCommonType,
  filter: {
    assetCode: string;
    address: string;
  }
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/storedAssetLandEstates?&${serialize({
      ...params,
      ...filter,
    })}`,
    {
      refreshInterval: 0,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
