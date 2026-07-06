import useSWR from "swr";

export const usePositions = (
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/positions`,
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
