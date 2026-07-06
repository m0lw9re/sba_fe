import useSWR from "swr";

export const useAssetLevelTwo = (assetLevelOne: number | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    assetLevelOne
      ? `/assets/api/v1/assetLevelTwo/get_by_asset_level_one/${assetLevelOne}`
      : null,
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
