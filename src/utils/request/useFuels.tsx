import useSWR from "swr";

export const useFuels = () => {
  const { data, error, isLoading, mutate } = useSWR("/assets/api/v1/fuels", {
    refreshInterval: 0,
  });
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
