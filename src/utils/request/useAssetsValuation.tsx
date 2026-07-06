import useSWR from "swr";
import { serialize } from "utils/validate";

export const useAssetsValuation = (
  appraisalFileId: string | null,
  assetLevelTwoId: number
) => {
  const { data, error, isLoading, mutate } = useSWR(
    appraisalFileId && assetLevelTwoId
      ? `/assets/api/v1/entire/valuation?${serialize({
          appraisalFileId,
          assetLevelTwoId,
        })}`
      : null,
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
