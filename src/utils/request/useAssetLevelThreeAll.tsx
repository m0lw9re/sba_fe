import useSWR from "swr";

export const useAssetLevelThreeAll = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/assets/api/v1/assetLevelThree/get_all",
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
