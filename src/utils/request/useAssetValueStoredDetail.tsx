import useSWR from "swr";

export const useAssetValueStoredDetail = (
  assetType: number,
  assetId: string | null
) => {
  const { data, error, isLoading, mutate } = useSWR(
    assetId
      ? `/assets/api/v2/storedAsset/assetInfo/${assetId}?assetType=${assetType}`
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
