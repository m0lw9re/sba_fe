import useSWR from "swr";
import { serialize } from "utils/validate";

export const useAssetsValuationDetail = (params: {
  appraisalFileId: string;
  assetLevelTwoId: number;
  assetId: string;
  assetChildId: number;
  assetGrandChildId: number;
  valuationMethodDetailId: number;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/entire/valuation/detail?${serialize({
      ...params,
    })}`,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
