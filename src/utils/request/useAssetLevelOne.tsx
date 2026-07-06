import useSWR from "swr";

export const useAssetLevelOne = () => {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR(`/assets/api/v1/assetLevelOne/get_all`, { 
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
