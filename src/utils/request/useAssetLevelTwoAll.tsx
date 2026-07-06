import useSWR from "swr";

export const useAssetLevelTwoAll = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/assets/api/v1/assetLevelTwo/get_all",
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
