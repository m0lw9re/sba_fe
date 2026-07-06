import useSWR from "swr";

export const useZones = (
) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/assets/api/v1/zones`,
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
