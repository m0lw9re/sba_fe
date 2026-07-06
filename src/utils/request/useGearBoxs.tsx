import useSWR from "swr";

export const useGearBox = () => {
  const { data, error, isLoading, mutate } = useSWR("/assets/api/v1/gearBoxs", {
    refreshInterval: 0,
  });
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
