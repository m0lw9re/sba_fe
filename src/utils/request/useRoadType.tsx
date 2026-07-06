import useSWR from "swr";

export const useRoadTypes = (
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/roadContiguousTypes`,
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
