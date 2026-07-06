import useSWR from "swr";

export const useAdjustCriteria = (assetLevelTwoId: number | string) => {
  const { data, error, isLoading, mutate } = useSWR(
    assetLevelTwoId ? `/assets/api/v1/adjustCriteria/${assetLevelTwoId}` : null,
    { refreshInterval: 0 }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
