import useSWR from "swr";

export const usePositionInPriceRanges = (
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/positionInPriceRanges`,
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
